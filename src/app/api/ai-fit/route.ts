import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const fallbackAiFitAlgorithm = (measurements: { height?: string, weight?: string, bodyType?: string }) => {
    // Basic fallback logic when AI is unavailable or missing key
    let recommendedSize = "M"; // Default
    let confidence = 75;
    let description = "Based on standard sizing, we recommend a medium. However, you haven't provided complete measurements yet.";

    if (measurements.weight) {
        const weightKg = parseFloat(measurements.weight);
        if (!isNaN(weightKg)) {
            if (weightKg < 60) {
                recommendedSize = "S";
                description = "Based on your weight, a small should fit well.";
            } else if (weightKg > 85) {
                recommendedSize = "L";
                description = "Based on your weight, a large is recommended.";
            } else {
                recommendedSize = "M";
                description = "Based on your weight, a medium is the safest bet.";
            }
            confidence = 85;
        }
    }

    if (measurements.bodyType) {
        description += ` We've also factored in your ${measurements.bodyType} body type.`;
    }

    return {
        recommendedSize,
        confidence,
        description
    };
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { height, weight, bodyType, productBrand, productCategory, productName } = body;

        // Basic sanitization of user inputs to prevent injection
        const sanitize = (str?: string) => str ? str.replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50) : "";
        const sHeight = sanitize(height);
        const sWeight = sanitize(weight);
        const sBodyType = sanitize(bodyType);

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to simple size recommendation.");
            return NextResponse.json(fallbackAiFitAlgorithm({ height: sHeight, weight: sWeight, bodyType: sBodyType }));
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Expert for an app called "Rare".
            Analyze the user's measurements and recommend the best clothing size for a specific product.

            User Measurements:
            - Height: ${sHeight || 'Not provided'}
            - Weight: ${sWeight || 'Not provided'}
            - Body Type: ${sBodyType || 'Not provided'}

            Product Details:
            - Brand: ${sanitize(productBrand) || 'Generic'}
            - Category: ${sanitize(productCategory) || 'Clothing'}
            - Name: ${sanitize(productName) || 'Product'}

            Return ONLY a JSON object with this structure (no markdown code blocks):
            {
                "recommendedSize": "S, M, L, XL, etc.",
                "confidence": 85, // integer 0-100
                "description": "Short explanation of why this size is recommended based on the user's body type and the brand's typical fit."
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error in Fit Check:", geminiError);
            return NextResponse.json(fallbackAiFitAlgorithm({ height: sHeight, weight: sWeight, bodyType: sBodyType }));
        }

        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini Fit Check response:", text);
            return NextResponse.json(fallbackAiFitAlgorithm({ height: sHeight, weight: sWeight, bodyType: sBodyType }));
        }

        return NextResponse.json({
            recommendedSize: parsedResponse.recommendedSize || "M",
            confidence: parsedResponse.confidence || 75,
            description: parsedResponse.description || "AI size recommendation."
        });

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
