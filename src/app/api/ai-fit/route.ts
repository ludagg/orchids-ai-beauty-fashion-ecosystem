import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function fallbackFitMatch(userHeight: string, userWeight: string, userBodyType: string, product: any) {
    // Basic local fallback algorithm
    const category = product.mainCategory?.toLowerCase() || "";
    const sizeKeys = product.sizes ? product.sizes.map((s: any) => s.name?.toLowerCase()) : [];

    let recommendedSize = "M"; // default
    if (sizeKeys.length > 0) {
        recommendedSize = sizeKeys[Math.floor(sizeKeys.length / 2)]; // pick middle
    }

    let confidence = 75;
    let explanation = `Based on your profile, we recommend size ${recommendedSize}.`;

    if (userBodyType && userBodyType.toLowerCase().includes("athletic") && category.includes("shirt")) {
        explanation += " This piece is somewhat fitted.";
    }

    return NextResponse.json({
        recommendedSize,
        confidence,
        explanation
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, height, weight, bodyType } = body;

        if (!productId || !height || !weight || !bodyType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const productResult = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!productResult) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to local algorithm.");
            return fallbackFitMatch(height, weight, bodyType, productResult);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Basic sanitization to prevent simple prompt injections
        const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);

        const safeHeight = sanitize(height);
        const safeWeight = sanitize(weight);
        const safeBodyType = sanitize(bodyType);

        const prompt = `
            You are an AI Fit Assistant for an app called "Rare".
            Analyze the user's profile measurements and the product details to recommend the best size.

            User Profile:
            - Height: ${safeHeight}
            - Weight: ${safeWeight}
            - Body Type: ${safeBodyType}

            Product Details:
            - Name: ${productResult.name}
            - Category: ${productResult.mainCategory} > ${productResult.subcategory}
            - Material: ${productResult.material || "Unknown"}
            - Description: ${productResult.description || "None"}
            - Available Sizes: ${productResult.sizes ? JSON.stringify(productResult.sizes) : "Unknown"}

            Calculate the best fitting size, a confidence score (0-100), and a brief friendly explanation.

            Return ONLY a JSON object with this structure (no markdown code blocks):
            {
                "recommendedSize": "string (e.g. M, L, 42)",
                "confidence": number (e.g. 85),
                "explanation": "string (brief explanation)"
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error in AI Fit:", geminiError);
            return fallbackFitMatch(height, weight, bodyType, productResult);
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response for AI Fit:", text);
            return fallbackFitMatch(height, weight, bodyType, productResult);
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}