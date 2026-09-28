import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Fallback logic in case Gemini API is not available or fails
function fallbackFitCheck(height: string, weight: string, bodyType: string) {
    const h = parseInt(height);
    const w = parseInt(weight);

    let recommendedSize = "M";
    let fitType = "perfect";
    let reasoning = "Based on general sizing guidelines for your measurements, we recommend this size for a comfortable fit.";
    let confidence = "Medium";

    if (h > 185 || w > 90) {
        recommendedSize = "XL";
    } else if (h > 175 || w > 75) {
        recommendedSize = "L";
    } else if (h < 160 || w < 55) {
        recommendedSize = "S";
    }

    if (bodyType === 'broad' || bodyType === 'curvy') {
         // recommend slightly larger or note tight fit
         if (recommendedSize === "M") {
             reasoning = "Given your body type, size M should fit well but might be slightly snug around the shoulders/hips.";
             fitType = "tight";
         }
    } else if (bodyType === 'slim') {
        if (recommendedSize === "M") {
             reasoning = "Size M will provide a relaxed, slightly looser fit for your body type.";
             fitType = "loose";
        }
    }

    return {
        recommendedSize,
        fitType,
        reasoning,
        confidence
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, productName, category, description, height, weight, bodyType } = body;

        if (!height || !weight || !bodyType) {
            return NextResponse.json({ error: "Missing measurements" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to local fit check.");
            const fallbackResult = fallbackFitCheck(height, weight, bodyType);
            return NextResponse.json(fallbackResult);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Expert for a fashion e-commerce app.
            A user wants to know what size to buy for the following product:

            Product Name: ${productName || 'Clothing Item'}
            Category: ${category || 'Apparel'}
            Description: ${description || 'No description provided'}

            User Measurements:
            Height: ${height} cm
            Weight: ${weight} kg
            Body Type: ${bodyType} (e.g., slim, athletic, curvy, broad, average)

            Based on these details, recommend the best size (XS, S, M, L, XL, XXL).
            Also provide:
            1. fitType: "tight", "perfect", or "loose"
            2. reasoning: A short, friendly explanation (1-2 sentences) of why this size is recommended.
            3. confidence: "High", "Medium", or "Low"

            Return ONLY a JSON object with this exact structure (no markdown formatting):
            {
                "recommendedSize": "M",
                "fitType": "perfect",
                "reasoning": "Your explanation here.",
                "confidence": "High"
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error for Fit Check:", geminiError);
            const fallbackResult = fallbackFitCheck(height, weight, bodyType);
            return NextResponse.json(fallbackResult);
        }

        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini fit response:", text);
            const fallbackResult = fallbackFitCheck(height, weight, bodyType);
            return NextResponse.json(fallbackResult);
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
