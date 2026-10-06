import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function fallbackFitCalculation(product: any, measurements: any) {
    // A simple mock fallback calculation if the AI is unavailable
    if (!measurements || (!measurements.height && !measurements.weight)) {
         return {
             recommendedSize: "M",
             explanation: "We recommend size M as a standard fit. Please update your profile measurements for a personalized recommendation.",
             confidence: 50
         };
    }

    const h = parseFloat(measurements.height) || 170; // cm
    const w = parseFloat(measurements.weight) || 70; // kg

    let recSize = "M";
    if (h > 185 || w > 90) recSize = "XL";
    else if (h > 175 || w > 80) recSize = "L";
    else if (h < 160 || w < 55) recSize = "S";

    return {
        recommendedSize: recSize,
        explanation: `Based on standard sizing charts for someone with your measurements (${measurements.height || h}cm, ${measurements.weight || w}kg), ${recSize} is the closest match.`,
        confidence: 70
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { product, measurements } = body;

        if (!product) {
            return NextResponse.json({ error: "Product information is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
             console.warn("GEMINI_API_KEY is not set. Falling back to simple calculation.");
             return NextResponse.json(fallbackFitCalculation(product, measurements));
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Assistant for a fashion app called "Rare".
            Your task is to analyze user measurements and a product description to recommend the best size.

            Product Info:
            Name: ${product.name || 'Unknown'}
            Category: ${product.category || 'Unknown'}
            Description: ${product.description || 'Unknown'}
            Available Sizes: ${JSON.stringify(product.sizes || [{name: 'S'}, {name: 'M'}, {name: 'L'}, {name: 'XL'}])}

            User Measurements:
            Height: ${measurements?.height || 'Not provided'}
            Weight: ${measurements?.weight || 'Not provided'}
            Body Type: ${measurements?.bodyType || 'Not provided'}

            Please provide a recommended size from the available sizes, a short explanation (1-2 sentences) of why this size is best based on their measurements and the product type, and a confidence score (0-100).
            If user measurements are missing or insufficient, recommend 'M' and explain that more data is needed for a better fit, with a low confidence score.

            Return ONLY a JSON object with this exact structure (no markdown blocks, just raw JSON):
            {
                "recommendedSize": "S/M/L/XL/etc.",
                "explanation": "Your reasoning here",
                "confidence": 85
            }
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

            const parsedResponse = JSON.parse(jsonString);

            return NextResponse.json({
                recommendedSize: parsedResponse.recommendedSize || "M",
                explanation: parsedResponse.explanation || "We couldn't generate a specific explanation.",
                confidence: parsedResponse.confidence || 50
            });

        } catch (geminiError) {
            console.error("Gemini API Error in AI Fit:", geminiError);
            return NextResponse.json(fallbackFitCalculation(product, measurements));
        }

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
