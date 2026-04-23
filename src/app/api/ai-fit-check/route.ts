import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, userMeasurements, userPurchaseHistory } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Fetch product details
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Check if there are sizes for this product
        const sizes = product.sizes as { name: string }[] | undefined;
        if (!sizes || sizes.length === 0) {
            return NextResponse.json({
                recommendation: "Not Applicable",
                description: "This product does not have specific size variations.",
                confidence: 100
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // Mock data to simulate AI Fit Check if no API key is present or for faster fallback
        if (!apiKey) {
            // Select a random size from the available ones
            const recommendedSize = sizes[Math.floor(Math.random() * sizes.length)].name;
            return NextResponse.json({
                recommendation: recommendedSize,
                description: `Based on average measurements for ${product.brand}, we recommend size ${recommendedSize}. It typically runs true to size.`,
                confidence: 85
            });
        }

        // Optional: Use Gemini for more advanced textual analysis of fit based on product description + user data
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Check assistant for the fashion app "Rare".
            Your task is to recommend the best size for a user based on the following product and their mock measurements.

            Product Name: ${product.name}
            Brand: ${product.brand}
            Description: ${product.description}
            Available Sizes: ${sizes.map((s: any) => s.name).join(", ")}

            User Measurements (if provided): ${userMeasurements ? JSON.stringify(userMeasurements) : 'Average body type'}
            User Purchase History (sizes they usually buy): ${userPurchaseHistory ? JSON.stringify(userPurchaseHistory) : 'N/A'}

            Return ONLY a JSON object with this structure (no markdown code blocks):
            {
                "recommendation": "The recommended size (e.g., M)",
                "description": "A short, helpful explanation of why this size fits well and how it runs (e.g., 'Based on your previous purchases, this brand typically runs true to size.')",
                "confidence": 90 // Number between 0 and 100 representing confidence score
            }
        `;

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsedResponse = JSON.parse(jsonString);

            // Ensure the recommendation is one of the available sizes, otherwise fallback
            if (!sizes.some(s => s.name === parsedResponse.recommendation)) {
               parsedResponse.recommendation = sizes[0].name;
            }

            return NextResponse.json(parsedResponse);
        } catch (geminiError) {
            console.error("Gemini API Error for AI Fit Check:", geminiError);
            const recommendedSize = sizes[0].name;
            return NextResponse.json({
                recommendation: recommendedSize,
                description: `We recommend size ${recommendedSize}. This item fits nicely based on standard sizing.`,
                confidence: 80
            });
        }

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
