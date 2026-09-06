import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

function sanitizeInput(input: string | null | undefined): string {
    if (!input) return "";
    return input.replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
}

function getFallbackRecommendation(user: any, product: any) {
    if (!user.height && !user.weight && !user.bodyType) {
        return {
            recommendation: "Please update your profile measurements to get a fit recommendation.",
            confidence: 0,
            analysis: "We don't have enough data to recommend a size."
        };
    }

    // Naive heuristic based on body type for demonstration purposes
    let recommendedSize = "M";
    const bodyType = (user.bodyType || "").toLowerCase();

    if (bodyType.includes("slim") || bodyType.includes("athletic")) {
        recommendedSize = "S";
    } else if (bodyType.includes("broad") || bodyType.includes("large")) {
        recommendedSize = "L";
    }

    // Check if the recommended size exists in the product options
    const availableSizes = product.sizes ? product.sizes.map((s: any) => s.name) : [];

    let isSizeAvailable = availableSizes.includes(recommendedSize);

    // If not, recommend the closest or first available
    if (!isSizeAvailable && availableSizes.length > 0) {
       recommendedSize = availableSizes[0];
    }

    return {
        recommendation: availableSizes.length > 0 ? recommendedSize : "One Size",
        confidence: 60,
        analysis: `Based on a basic analysis of your profile, we suggest size ${recommendedSize}. For more accurate results, add more measurements.`
    };
}

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

        // Fetch user from DB to get the latest measurements (since they might not be in session depending on auth config)
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, session.user.id)
        });

        if (!user) {
             return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to local fit heuristic.");
            return NextResponse.json(getFallbackRecommendation(user, product));
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const safeHeight = sanitizeInput(user.height);
        const safeWeight = sanitizeInput(user.weight);
        const safeBodyType = sanitizeInput(user.bodyType);

        if (!safeHeight && !safeWeight && !safeBodyType) {
             return NextResponse.json({
                recommendation: "Missing Data",
                confidence: 0,
                analysis: "Please update your profile measurements (height, weight, body type) to get a personalized fit recommendation."
            });
        }

        const availableSizes = product.sizes ? product.sizes.map((s: any) => s.name).join(", ") : "No specific sizes listed";

        const prompt = `
            You are an expert AI Fit Assistant for an app called "Rare".
            Your task is to recommend the best clothing size for a user based on their measurements and the product details.

            User Profile:
            - Height: ${safeHeight || "Unknown"}
            - Weight: ${safeWeight || "Unknown"}
            - Body Type: ${safeBodyType || "Unknown"}

            Product Details:
            - Name: ${product.name}
            - Brand: ${product.brand}
            - Category: ${product.category || product.mainCategory}
            - Description: ${product.description}
            - Available Sizes: ${availableSizes}

            Analyze the user's measurements against typical sizing charts for this type of garment and brand.
            Provide a recommended size from the available sizes. If the available sizes are unknown, suggest a standard size (S, M, L, XL).
            Provide a confidence score (0-100) for your recommendation.
            Provide a short, friendly explanation (analysis) of why you chose this size.

            Return ONLY a JSON object with this exact structure (no markdown code blocks):
            {
                "recommendation": "The recommended size string (e.g., 'M', 'Large')",
                "confidence": 85,
                "analysis": "Your brief explanation here."
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error for AI Fit:", geminiError);
            return NextResponse.json(getFallbackRecommendation(user, product));
        }

        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response for AI Fit:", text);
            return NextResponse.json(getFallbackRecommendation(user, product));
        }

        return NextResponse.json({
            recommendation: parsedResponse.recommendation,
            confidence: parsedResponse.confidence,
            analysis: parsedResponse.analysis
        });

    } catch (error) {
        console.error("AI Fit API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
