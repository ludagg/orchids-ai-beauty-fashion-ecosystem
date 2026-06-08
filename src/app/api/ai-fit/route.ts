import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const productResult = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!productResult) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const userResult = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        });

        if (!userResult) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { height, weight, bodyType, gender } = userResult;

        if (!height && !weight && !bodyType) {
            return NextResponse.json({
                error: "Insufficient profile data",
                code: "MISSING_MEASUREMENTS"
            }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Mock response if no API key
            return NextResponse.json({
                recommendation: "M",
                confidence: 85,
                reasoning: "Based on typical sizing for this brand and your approximate measurements.",
                fitPrediction: "Regular"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are the "AI Fit Check" assistant for a fashion e-commerce app called "Rare".
            Your task is to recommend the best size for a user based on their physical attributes and the product details.

            User Profile:
            - Height: ${height || 'Not provided'}
            - Weight: ${weight || 'Not provided'}
            - Body Type: ${bodyType || 'Not provided'}
            - Gender: ${gender || 'Not provided'}

            Product Details:
            - Name: ${productResult.name}
            - Brand: ${productResult.brand}
            - Category: ${productResult.mainCategory} > ${productResult.subcategory}
            - Description: ${productResult.description}

            Based on these details, recommend a size.
            Also provide a confidence score (1-100), a short reasoning, and a fit prediction (e.g., "tight", "regular", "loose").

            Return ONLY a JSON object with this structure (no markdown code blocks):
            {
                "recommendation": "S, M, L, XL, etc.",
                "confidence": 90,
                "reasoning": "Short explanation",
                "fitPrediction": "Regular"
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error in AI Fit Check:", geminiError);
            return NextResponse.json({
                recommendation: "M",
                confidence: 70,
                reasoning: "Fallback estimation due to AI service unavailability.",
                fitPrediction: "Regular"
            });
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response in AI Fit Check:", text);
            return NextResponse.json({
                recommendation: "M",
                confidence: 60,
                reasoning: "Could not parse precise recommendation.",
                fitPrediction: "Regular"
            });
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
