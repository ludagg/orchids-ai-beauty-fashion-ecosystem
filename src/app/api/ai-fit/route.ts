import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, productName, productBrand, productCategory, userProfile, availableSizes } = body;

        if (!userProfile || !userProfile.height || !userProfile.weight) {
            return NextResponse.json({ error: "Missing user profile measurements" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Fallback basic algorithm if no API key
            const bmi = Number(userProfile.weight) / Math.pow(Number(userProfile.height) / 100, 2);
            let fallbackSize = "M";
            if (bmi < 18.5) fallbackSize = "S";
            else if (bmi > 25 && bmi < 30) fallbackSize = "L";
            else if (bmi >= 30) fallbackSize = "XL";

            return NextResponse.json({
                size: fallbackSize,
                confidence: 75,
                fitPrediction: "perfect",
                explanation: "Based on basic BMI calculations, this size should offer a comfortable fit."
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert AI fashion sizing assistant.
            Product: ${productName} (Brand: ${productBrand || 'Unknown'}, Category: ${productCategory || 'Clothing'})
            Available Sizes: ${JSON.stringify(availableSizes)}
            User Profile: Height ${userProfile.height}cm, Weight ${userProfile.weight}kg, Body Type: ${userProfile.bodyType || 'average'}.

            Analyze these details and recommend the BEST fitting size from the Available Sizes list.
            Also provide a confidence score (0-100), a fit prediction (tight, perfect, loose), and a brief, friendly 1-2 sentence explanation.

            Return ONLY a JSON object with this exact structure (no markdown):
            {
                "size": "string (the recommended size from the list)",
                "confidence": number (0-100),
                "fitPrediction": "string (tight, perfect, or loose)",
                "explanation": "string (your friendly explanation)"
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const recommendation = JSON.parse(jsonString);

        return NextResponse.json(recommendation);

    } catch (error) {
        console.error("AI Fit API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
