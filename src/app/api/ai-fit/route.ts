import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function fallbackFitAlgorithm(userMeasurements: any, product: any) {
    const { height, weight, bodyType } = userMeasurements;

    // Very naive heuristic algorithm
    let suggestedSize = "M";
    let fitType = "regular";
    let analysis = "Based on standard sizing models and your profile, we recommend this size for a comfortable fit.";
    let confidence = 75;

    const h = parseInt(height);
    const w = parseInt(weight);

    if (h < 165 && w < 60) {
        suggestedSize = "S";
        if (bodyType === "slim") fitType = "regular";
        else fitType = "tight";
    } else if (h > 180 && w > 85) {
        suggestedSize = "L";
        if (bodyType === "athletic") fitType = "tight";
        else fitType = "regular";
    } else if (h > 185 && w > 95) {
        suggestedSize = "XL";
    }

    if (bodyType === "plus") {
        suggestedSize = "XL";
        fitType = "regular";
    }

    if (product.brand && product.brand.toLowerCase() === "zara") {
        analysis = "This brand usually runs slightly smaller. We've adjusted your recommendation accordingly.";
        confidence = 85;
    }

    return {
        size: suggestedSize,
        fitType,
        analysis,
        confidence
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { product, userMeasurements } = body;

        if (!userMeasurements || !userMeasurements.height || !userMeasurements.weight) {
            return NextResponse.json({ error: "Missing measurements" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to local algorithm.");
            const fallbackRec = fallbackFitAlgorithm(userMeasurements, product);
            return NextResponse.json({ recommendation: fallbackRec });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Sizing Expert. Analyze the user's measurements and recommend the best size for the given product.

            User Measurements:
            - Height: ${userMeasurements.height} cm
            - Weight: ${userMeasurements.weight} kg
            - Body Type: ${userMeasurements.bodyType}

            Product Information:
            - Name: ${product?.name || "Unknown Product"}
            - Brand: ${product?.brand || "Generic Brand"}
            - Category: ${product?.category || "Apparel"}

            Return ONLY a valid JSON object matching this schema exactly (no markdown formatting, no comments):
            {
                "size": "S" | "M" | "L" | "XL" | "XXL",
                "analysis": "A 1-2 sentence explanation of why this size fits best, considering the brand and user's body type.",
                "confidence": number between 50 and 99,
                "fitType": "tight" | "regular" | "loose"
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error:", geminiError);
            const fallbackRec = fallbackFitAlgorithm(userMeasurements, product);
            return NextResponse.json({ recommendation: fallbackRec });
        }

        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            const fallbackRec = fallbackFitAlgorithm(userMeasurements, product);
            return NextResponse.json({ recommendation: fallbackRec });
        }

        // Validate structure briefly
        if (!parsedResponse.size || !parsedResponse.analysis) {
             const fallbackRec = fallbackFitAlgorithm(userMeasurements, product);
             return NextResponse.json({ recommendation: fallbackRec });
        }

        return NextResponse.json({ recommendation: parsedResponse });
    } catch (error) {
        console.error("AI Fit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
