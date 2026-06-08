import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, userMeasurements } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Fetch product details to inform the AI
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // If no API key or no user measurements, return a fallback mock response
        if (!apiKey || !userMeasurements) {
             console.warn("AI Fit Check: Missing API Key or Measurements. Using fallback.");
             // Simulate a network delay
             await new Promise(resolve => setTimeout(resolve, 1500));
             return NextResponse.json({
                 recommendedSize: "M",
                 analysis: `Based on general sizing for the brand ${product.brand}, a size M should provide a comfortable fit with a slightly relaxed silhouette.`,
                 confidence: 85,
                 dataPoints: 12
             });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert AI Fashion Fit Analyst for an app called "Rare".
            Analyze the following product and user measurements to recommend a clothing size.

            Product Name: ${product.name}
            Product Brand: ${product.brand}
            Product Material: ${product.material || 'Unknown'}
            Available Sizes: ${JSON.stringify(product.sizes || [{name: 'S'}, {name: 'M'}, {name: 'L'}])}

            User Measurements:
            Height: ${userMeasurements.height || 'Unknown'}
            Weight: ${userMeasurements.weight || 'Unknown'}
            Body Type: ${userMeasurements.bodyType || 'Unknown'}

            Instructions:
            1. Determine the best size from the available sizes.
            2. Write a short, personalized analysis explaining WHY this size is recommended (consider the brand, material stretch, and user body type).
            3. Provide a confidence score between 70 and 99.
            4. Output MUST be valid JSON only. No markdown formatting or code blocks.

            Example Output format:
            {
                "recommendedSize": "M",
                "analysis": "Given your height and weight, and since this brand runs true to size with stretchy material, M is perfect for a regular fit.",
                "confidence": 92,
                "dataPoints": 15
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const parsedResponse = JSON.parse(jsonString);

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
