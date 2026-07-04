import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function fallbackFitRecommendation(height: string, weight: string, bodyType: string, product: any) {
    // A simple heuristic fallback if API key is not available
    let recommendedSize = "M"; // Default
    let explanation = "Based on general sizing guidelines, we recommend this size for you.";

    const h = parseInt(height);
    const w = parseInt(weight);

    if (!isNaN(h) && !isNaN(w)) {
        if (h > 185 || w > 90) {
            recommendedSize = "XL";
            explanation = "Based on your height and weight, an XL should provide a comfortable fit.";
        } else if (h > 175 || w > 75) {
            recommendedSize = "L";
            explanation = "A size L usually accommodates your measurements well.";
        } else if (h < 165 || w < 60) {
            recommendedSize = "S";
            explanation = "A size S is generally recommended for your height and weight.";
        } else {
            recommendedSize = "M";
            explanation = "Your measurements align with our standard size M.";
        }
    }

    if (bodyType === "athletic") {
        explanation += " The athletic fit will offer more room in the shoulders and chest.";
    } else if (bodyType === "slim") {
        explanation += " A slimmer cut will complement your build.";
    }

    // Check if product has sizes
    const availableSizes = product.sizes?.map((s: any) => s.name) || [];
    if (availableSizes.length > 0 && !availableSizes.includes(recommendedSize)) {
        recommendedSize = availableSizes[0]; // fallback to first available
        explanation += ` However, since that size is not available, we suggest trying ${recommendedSize}.`;
    }

    return {
        recommendedSize,
        explanation,
        confidence: 0.7
    };
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        const body = await req.json();
        const { productId, height: reqHeight, weight: reqWeight, bodyType: reqBodyType } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        let height = reqHeight;
        let weight = reqWeight;
        let bodyType = reqBodyType;

        // If user is logged in and didn't provide measurements in request, fetch from DB
        if (session?.user && (!height || !weight || !bodyType)) {
            const user = await db.query.users.findFirst({
                where: eq(users.id, session.user.id),
                columns: { height: true, weight: true, bodyType: true }
            });

            if (user) {
                height = height || user.height;
                weight = weight || user.weight;
                bodyType = bodyType || user.bodyType;
            }
        }

        if (!height || !weight) {
             return NextResponse.json({ error: "Height and weight are required for AI Fit Check" }, { status: 400 });
        }

        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to heuristic sizing.");
            const fallbackResult = await fallbackFitRecommendation(height, weight, bodyType, product);
            return NextResponse.json(fallbackResult);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const availableSizes = product.sizes?.map((s: any) => s.name).join(", ") || "No specific sizes listed (e.g., One Size)";

        const prompt = `
            You are an expert AI Fit Assistant for a fashion app called "Rare".
            Your task is to recommend the best clothing size for a user based on their measurements and the product details.

            User Profile:
            - Height: ${height}
            - Weight: ${weight}
            - Body Type: ${bodyType || 'Not specified'}

            Product Details:
            - Name: ${product.name}
            - Brand: ${product.brand}
            - Description: ${product.description}
            - Available Sizes: ${availableSizes}

            Analyze the product description (look for words like "oversized", "slim fit", "stretchy") and the user's measurements.
            Predict how the item will fit (tight, regular, loose).
            Provide a clear size recommendation from the available sizes. If none fit perfectly, recommend the closest one.
            Also provide a short explanation (max 2 sentences) for your choice.

            Return ONLY a JSON object with this exact structure (no markdown blocks):
            {
                "recommendedSize": "S/M/L/etc.",
                "explanation": "Your concise explanation here.",
                "confidence": 0.95 // A number between 0 and 1
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error in AI Fit Check:", geminiError);
            const fallbackResult = await fallbackFitRecommendation(height, weight, bodyType, product);
            return NextResponse.json(fallbackResult);
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response for AI Fit:", text);
            const fallbackResult = await fallbackFitRecommendation(height, weight, bodyType, product);
            return NextResponse.json(fallbackResult);
        }

        return NextResponse.json({
            recommendedSize: parsedResponse.recommendedSize,
            explanation: parsedResponse.explanation,
            confidence: parsedResponse.confidence || 0.8
        });

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
