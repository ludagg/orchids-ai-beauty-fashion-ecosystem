import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

function fallbackRecommendation(user: any, product: any) {
    // A simple deterministic fallback based on weight / bodyType for demonstration
    const weightStr = user.weight || "";
    const weightNum = parseInt(weightStr.replace(/\D/g, ""), 10);

    let size = "M";
    if (!isNaN(weightNum)) {
        if (weightNum < 60) size = "S";
        else if (weightNum > 85) size = "L";
        else if (weightNum > 100) size = "XL";
    }

    return {
        recommendedSize: size,
        confidence: 70,
        explanation: `Based on standard sizing charts for your profile, we recommend size ${size}. Note: This is an estimated fit. Add more specific measurements for better accuracy.`,
        fitDetails: "Standard Fit"
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "productId is required" }, { status: 400 });
        }

        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch User Data
        const userRecords = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
        if (userRecords.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const user = userRecords[0];

        if (!user.height && !user.weight && !user.bodyType) {
             return NextResponse.json({
                 error: "Profile incomplete",
                 message: "Please add your height, weight, or body type to your profile for personalized fit recommendations."
             }, { status: 400 });
        }

        // Fetch Product Data
        const productRecords = await db.select().from(products).where(eq(products.id, productId)).limit(1);
        if (productRecords.length === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        const product = productRecords[0];

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to basic sizing logic.");
            return NextResponse.json(fallbackRecommendation(user, product));
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                You are an expert fashion stylist and tailor AI named "Rare Fit AI".
                Your task is to recommend the best clothing size for a user based on their measurements and the product details.

                User Profile:
                - Height: ${user.height || "Unknown"}
                - Weight: ${user.weight || "Unknown"}
                - Body Type: ${user.bodyType || "Unknown"}

                Product Details:
                - Name: ${product.name}
                - Brand: ${product.brand}
                - Category: ${product.mainCategory} > ${product.subcategory}
                - Description: ${product.description}
                - Material: ${product.material || "Unknown"}

                Available Sizes: ${JSON.stringify(product.sizes) || "Standard (S, M, L, XL)"}

                Analyze the user's body profile against the brand and product type to determine the best fit.

                Return ONLY a JSON object with this exact structure (no markdown code blocks):
                {
                    "recommendedSize": "S" or "M" or "L" etc.,
                    "confidence": a number from 0 to 100,
                    "explanation": "A friendly, short paragraph explaining why this size is recommended based on their body type and the product's cut/material.",
                    "fitDetails": "e.g., True to Size, Runs Small, Relaxed Fit"
                }
            `;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

            let parsedResponse;
            try {
                parsedResponse = JSON.parse(jsonString);
            } catch (e) {
                console.error("Failed to parse Gemini response:", text);
                return NextResponse.json(fallbackRecommendation(user, product));
            }

            return NextResponse.json(parsedResponse);

        } catch (geminiError) {
             console.error("Gemini API Error:", geminiError);
             return NextResponse.json(fallbackRecommendation(user, product));
        }

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
