import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
    if (process.env.GEMINI_API_KEY) {
        return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return null;
};

// Fallback logic for when Gemini isn't available or fails
function getLocalFitRecommendation(measurements: any, productData: any) {
    if (!measurements || !measurements.height || !measurements.weight || !measurements.bodyType) {
        return {
            recommendation: "Insufficient measurements.",
            explanation: "Please provide your height, weight, and body type for a personalized fit check.",
            confidence: "low",
            recommendedSize: null,
            fitPrediction: "unknown"
        };
    }

    // Very naive heuristic for testing purposes
    const weight = parseInt(measurements.weight);
    let size = "M";

    if (weight < 60) size = "S";
    else if (weight > 85) size = "L";

    if (productData.brand?.toLowerCase() === "zara") {
        // Zara runs small usually
        if (size === "S") size = "M";
        else if (size === "M") size = "L";
        else if (size === "L") size = "XL";
    }

    const availableSizes = productData.sizes?.map((s: any) => s.name) || [];
    if (availableSizes.length > 0 && !availableSizes.includes(size)) {
         size = availableSizes[0]; // fallback
    }

    return {
        recommendation: `Based on standard sizing, we recommend size ${size}.`,
        explanation: `Using local estimation based on your weight (${weight}kg) and body type (${measurements.bodyType}).`,
        confidence: "medium",
        recommendedSize: size,
        fitPrediction: "regular"
    };
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productData, measurements } = body;

        if (!productData) {
            return NextResponse.json({ error: "Product data required" }, { status: 400 });
        }

        const userMeasurements = measurements || {
             height: session.user.height,
             weight: session.user.weight,
             bodyType: session.user.bodyType,
        };

        const genAI = getGenAI();

        if (!genAI) {
            console.log("No Gemini API key, using local fallback");
            return NextResponse.json(getLocalFitRecommendation(userMeasurements, productData));
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
            You are an AI Fit Expert. Given a user's measurements and a clothing product's details, predict the best size and how it will fit.

            User Measurements:
            Height: ${userMeasurements.height || "Unknown"}
            Weight: ${userMeasurements.weight || "Unknown"}
            Body Type: ${userMeasurements.bodyType || "Unknown"}

            Product Details:
            Name: ${productData.name}
            Brand: ${productData.brand}
            Description: ${productData.description}
            Material: ${productData.material || "Unknown"}
            Available Sizes: ${productData.sizes?.map((s: any) => s.name).join(", ") || "Unknown"}

            Analyze the fit. Respond ONLY in valid JSON format matching this schema:
            {
                "recommendation": "Short summary of the recommendation",
                "explanation": "Detailed explanation of why this size was chosen considering brand sizing and material stretch",
                "confidence": "high|medium|low",
                "recommendedSize": "The specific size name (e.g. 'M')",
                "fitPrediction": "tight|regular|loose"
            }
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Extract JSON from markdown if present
            const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
            const aiData = JSON.parse(jsonStr);

            return NextResponse.json(aiData);

        } catch (aiError) {
             console.error("AI Gen Error:", aiError);
             // Fallback if AI fails
             return NextResponse.json(getLocalFitRecommendation(userMeasurements, productData));
        }

    } catch (error: any) {
        console.error("Fit Check API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}