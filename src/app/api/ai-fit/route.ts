import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { height, weight, bodyType, productBrand, productCategory } = body;

        // Note: Real implementations would also consider previous purchases and brand sizing guides

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || !height || !weight) {
             // Fallback Logic
             let recommendedSize = "M";
             if (weight > 85) recommendedSize = "XL";
             else if (weight > 75) recommendedSize = "L";
             else if (weight < 60) recommendedSize = "S";

             return NextResponse.json({
                recommendedSize,
                confidence: 75,
                reasoning: `Based on general sizing guidelines for someone ${height}cm and ${weight}kg, we recommend size ${recommendedSize}.`,
                fitType: "Regular Fit"
             });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Basic prompt injection prevention/sanitization
        const safeHeight = height.toString().replace(/[^0-9.]/g, '').substring(0, 10);
        const safeWeight = weight.toString().replace(/[^0-9.]/g, '').substring(0, 10);
        const safeBodyType = (bodyType || "average").replace(/[^a-zA-Z ]/g, '').substring(0, 20);
        const safeBrand = (productBrand || "generic").replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 30);
        const safeCategory = (productCategory || "clothing").replace(/[^a-zA-Z ]/g, '').substring(0, 20);

        const prompt = `
            You are an AI Fit Assistant for a fashion app.
            Analyze the following user data and product info to recommend the best size.

            User Height: ${safeHeight} cm
            User Weight: ${safeWeight} kg
            User Body Type: ${safeBodyType}

            Product Brand: ${safeBrand}
            Product Category: ${safeCategory}

            Return ONLY a JSON object with this structure (no markdown):
            {
                "recommendedSize": "S/M/L/XL/etc",
                "confidence": number between 1 and 100,
                "reasoning": "A short, helpful explanation (max 2 sentences)",
                "fitType": "Tight / Regular / Loose"
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const parsedResponse = JSON.parse(jsonString);

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
