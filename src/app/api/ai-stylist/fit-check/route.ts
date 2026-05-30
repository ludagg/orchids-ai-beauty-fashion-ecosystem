import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit({
    interval: 60000,
    uniqueTokenPerInterval: 500,
});

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        try {
            await limiter.check(5, `ai-fit-check-${ip}`);
        } catch {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId, userProfile } = body;

        if (!productId || !userProfile || !userProfile.height || !userProfile.weight) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Returning mock fit data.");
            return NextResponse.json({
                recommendedSize: "M",
                confidenceScore: 85,
                explanation: "Based on standard sizing for your measurements.",
                fitType: "regular"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Intelligence expert for a fashion e-commerce app.
            Your task is to recommend the best size for a user based on their physical profile and the product details.

            User Profile:
            - Height: ${userProfile.height} cm
            - Weight: ${userProfile.weight} kg
            - Body Type (optional): ${userProfile.bodyType || 'average'}

            Product Details:
            - Name: "${product.name}"
            - Category: "${product.mainCategory}" / "${product.subcategory}"
            - Description: "${product.description}"

            Please analyze this and recommend the best size (e.g., XS, S, M, L, XL, XXL).
            Also, provide a confidence score (0-100), a short explanation, and the expected fit type ('tight', 'regular', 'loose').

            Return ONLY a valid JSON object with this exact structure:
            {
                "recommendedSize": "M",
                "confidenceScore": 85,
                "explanation": "Short string explaining why",
                "fitType": "regular"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const fitData = JSON.parse(jsonString);

        return NextResponse.json(fitData);

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
