import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function sanitizeInput(input: string | undefined | null): string {
    if (!input) return "not provided";
    return input.replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { height, weight, bodyType, product } = body;

        const safeHeight = sanitizeInput(height);
        const safeWeight = sanitizeInput(weight);
        const safeBodyType = sanitizeInput(bodyType);
        const productName = sanitizeInput(product?.name);
        const productCategory = sanitizeInput(product?.category);

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to simple logic.");
            return NextResponse.json({
                recommendation: "M",
                explanation: `Based on your profile, we recommend trying size M as a safe choice for ${productName || "this item"}. This brand generally fits true to size.`,
                confidence: 70
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Expert for a fashion store called "Rare".
            Analyze the following user measurements and product details to recommend a size (e.g., XS, S, M, L, XL).

            User Profile:
            - Height: ${safeHeight}
            - Weight: ${safeWeight}
            - Body Type: ${safeBodyType}

            Product Details:
            - Name: ${productName}
            - Category: ${productCategory}

            Return ONLY a JSON object with this exact structure (no markdown blocks, no extra text):
            {
                "recommendation": "Size string (e.g., S, M, L)",
                "explanation": "A short, friendly sentence explaining why this size is recommended based on the user's profile.",
                "confidence": number between 0 and 100
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error in AI Fit:", geminiError);
             return NextResponse.json({
                recommendation: "M",
                explanation: "We couldn't analyze the fit closely right now, but size M is a popular choice.",
                confidence: 50
            });
        }

        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json({
                recommendation: "M",
                explanation: "M is the safest bet for this item based on general sizing.",
                confidence: 60
            });
        }

        return NextResponse.json({
            recommendation: parsedResponse.recommendation || "M",
            explanation: parsedResponse.explanation || "Size M is generally a safe choice.",
            confidence: parsedResponse.confidence || 60
        });

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
