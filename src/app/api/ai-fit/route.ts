import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function fallbackFitLogic(height: number, weight: number, bodyType: string) {
    // A very simple deterministic fallback based on generic BMI/height heuristics
    const bmi = weight / ((height / 100) * (height / 100));

    let size = "M";
    if (bmi < 18.5) size = "S";
    else if (bmi >= 25 && bmi < 30) size = "L";
    else if (bmi >= 30) size = "XL";

    if (height > 185 && size === "M") size = "L";
    if (height < 160 && size === "M") size = "S";

    return {
        recommendedSize: size,
        confidence: 65,
        reasoning: "Based on standard height and weight distribution. (Fallback algorithm applied)"
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = session.user as any;
        if (!user.height || !user.weight) {
            return NextResponse.json({ error: "User measurements missing" }, { status: 400 });
        }

        const height = parseFloat(user.height);
        const weight = parseFloat(user.weight);
        const bodyType = user.bodyType || "average";

        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
             console.warn("GEMINI_API_KEY is not set. Falling back to simple fit logic.");
             return NextResponse.json(fallbackFitLogic(height, weight, bodyType));
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Expert for an app called "Rare".
            Your task is to recommend the best clothing size for a user based on their measurements and the product details.

            User Profile:
            - Height: ${height} cm
            - Weight: ${weight} kg
            - Body Type: ${bodyType}

            Product Details:
            - Name: "${product.name}"
            - Brand: "${product.brand}"
            - Category: "${product.mainCategory} / ${product.subcategory}"
            - Description: "${product.description}"
            - Available Sizes: ${product.sizes ? JSON.stringify(product.sizes) : "Standard S/M/L/XL"}

            Analyze the correlation between the user's BMI/body type and the likely fit of this specific type of garment.
            Provide a recommended size (e.g., XS, S, M, L, XL, XXL).
            Provide a confidence score between 1 and 100.
            Provide a brief, friendly reasoning (1-2 sentences) explaining why this size is recommended based on their specific measurements and the item type.

            Return ONLY a JSON object with this exact structure (no markdown tags):
            {
                "recommendedSize": "M",
                "confidence": 85,
                "reasoning": "Your text here."
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error:", geminiError);
            return NextResponse.json(fallbackFitLogic(height, weight, bodyType));
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json(fallbackFitLogic(height, weight, bodyType));
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
