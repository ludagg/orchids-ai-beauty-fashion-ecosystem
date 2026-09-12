import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const sanitize = (str: string | undefined | null) => {
    if (typeof str !== 'string') return null;
    return str.replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const height = sanitize(body.height) || "unknown";
        const weight = sanitize(body.weight) || "unknown";
        const bodyType = sanitize(body.bodyType) || "unknown";
        const productData = body.product || {};

        const productName = sanitize(productData.name) || "Item";
        const productCategory = sanitize(productData.category) || "Clothing";
        const productBrand = sanitize(productData.brand) || "Generic";

        const availableSizes = Array.isArray(productData.sizes)
            ? productData.sizes.map((s: any) => s.name || s).join(", ")
            : "S, M, L, XL";

        const apiKey = process.env.GEMINI_API_KEY;

        const generateFallbackRecommendation = () => {
             // Fallback algorithm
             const h = parseInt(height, 10);
             let recSize = "M";

             if (!isNaN(h)) {
                 if (h < 165) recSize = "S";
                 else if (h > 185) recSize = "L";
             }

             if (bodyType.toLowerCase().includes("athletic") || bodyType.toLowerCase().includes("broad")) {
                 if (recSize === "S") recSize = "M";
                 if (recSize === "M") recSize = "L";
             }

             return NextResponse.json({
                 recommendedSize: recSize,
                 confidence: 75,
                 reasoning: `Based on a basic analysis of your profile, we estimate ${recSize} to be the best starting point.`,
                 fitPrediction: "Regular Fit"
             });
        };

        if (!apiKey) {
             console.warn("GEMINI_API_KEY is not set. Falling back to simple heuristic.");
             return generateFallbackRecommendation();
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Check assistant for a fashion app called "Rare".
            Your goal is to recommend the best clothing size and predict the fit for a user based on their measurements and the product details.

            User Profile:
            - Height: ${height}
            - Weight: ${weight}
            - Body Type: ${bodyType}

            Product Details:
            - Name: ${productName}
            - Category: ${productCategory}
            - Brand: ${productBrand}
            - Available Sizes: ${availableSizes}

            Please analyze this and provide a recommendation. Return ONLY a JSON object with this structure (no markdown code blocks, no other text):
            {
                "recommendedSize": "The recommended size (e.g., 'S', 'M', 'L', or specific numeric size if provided in available sizes)",
                "confidence": 85, // A number between 0 and 100 representing your confidence
                "reasoning": "A short, friendly sentence explaining why this size is recommended based on their body type and the brand's typical sizing.",
                "fitPrediction": "A short phrase describing how it will fit (e.g., 'Slim fit', 'Regular fit', 'Loose/Oversized')"
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error in AI Fit:", geminiError);
            return generateFallbackRecommendation();
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response for AI Fit:", text);
            return generateFallbackRecommendation();
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
