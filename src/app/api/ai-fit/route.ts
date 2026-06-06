import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const userRecord = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        });

        if (!userRecord) {
             return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { height, weight, bodyType } = userRecord;

        if (!height || !weight) {
            return NextResponse.json({
                error: "Missing profile details",
                code: "MISSING_MEASUREMENTS",
                message: "Please complete your profile with your height and weight for an accurate AI Fit Check."
            }, { status: 400 });
        }

        const productRecord = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!productRecord) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Fallback mock if no API key
            return NextResponse.json({
                recommendedSize: "M",
                confidenceScore: 85,
                explanation: `Based on your profile (${height}, ${weight}), size M is recommended for this ${productRecord.brand || 'brand'}.`
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Check assistant for a fashion app called "Rare".
            Your task is to recommend the best clothing size for a user based on their measurements and the product details.

            User Profile:
            - Height: ${height}
            - Weight: ${weight}
            - Body Type: ${bodyType || 'Not specified'}

            Product Details:
            - Name: ${productRecord.name}
            - Category: ${productRecord.mainCategory} / ${productRecord.subcategory}
            - Brand: ${productRecord.brand || 'Unknown'}
            - Description: ${productRecord.description || 'No description'}

            Based on this information, determine the best fitting size (e.g., XS, S, M, L, XL, XXL) or specific shoe/waist size if applicable.
            Calculate a confidence score between 0 and 100 based on how sure you are of the fit.
            Provide a short explanation for your recommendation.

            Return ONLY a JSON object with this structure (no markdown code blocks, no other text):
            {
                "recommendedSize": "The recommended size string",
                "confidenceScore": 90,
                "explanation": "Short explanation of why this size fits best."
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        let aiRecommendation;
        try {
            aiRecommendation = JSON.parse(jsonString);
        } catch (parseError) {
             console.error("Failed to parse Gemini response for AI Fit:", responseText);
             return NextResponse.json({
                recommendedSize: "M",
                confidenceScore: 70,
                explanation: "Could not generate precise recommendation. Please refer to the size guide."
            });
        }

        return NextResponse.json(aiRecommendation);

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
