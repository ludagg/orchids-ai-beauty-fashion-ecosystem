import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function fallbackAiFit(user: any, product: any) {
    let size = "M";
    if (user.height && parseInt(user.height) > 180) size = "L";
    if (user.height && parseInt(user.height) > 190) size = "XL";
    if (user.height && parseInt(user.height) < 165) size = "S";

    if (user.weight && parseInt(user.weight) > 90) size = "XL";
    if (user.weight && parseInt(user.weight) < 60) size = "S";

    return NextResponse.json({
        recommendedSize: size,
        confidence: 0.85,
        explanation: `Based on your profile, we recommend size ${size}. This product typically runs true to size.`,
        fitType: "regular"
    });
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const body = await req.json();
        const { productId, height, weight, bodyType } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        let userMeasurements = { height, weight, bodyType };

        if (session) {
            const dbUser = await db.query.users.findFirst({
                where: eq(users.id, session.user.id)
            });
            if (dbUser) {
                userMeasurements = {
                    height: height || dbUser.height,
                    weight: weight || dbUser.weight,
                    bodyType: bodyType || dbUser.bodyType
                };
            }
        }

        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
             console.warn("GEMINI_API_KEY is not set. Falling back to simple matching.");
             return fallbackAiFit(userMeasurements, product);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Assistant for a fashion app. Your job is to recommend the best clothing size for a user based on their measurements and the product details.

            User Measurements:
            - Height: ${userMeasurements.height || "Unknown"}
            - Weight: ${userMeasurements.weight || "Unknown"}
            - Body Type: ${userMeasurements.bodyType || "Unknown"}

            Product Details:
            - Name: ${product.name}
            - Category: ${product.mainCategory}
            - Material: ${product.material || "Unknown"}

            Based on this information, what size would you recommend? (S, M, L, XL)
            Also provide a confidence score (0 to 1) and a short explanation.

            Return ONLY a JSON object with this structure (no markdown code blocks):
            {
                "recommendedSize": "M",
                "confidence": 0.85,
                "explanation": "Your explanation here",
                "fitType": "tight | regular | loose"
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error:", geminiError);
            return fallbackAiFit(userMeasurements, product);
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            return fallbackAiFit(userMeasurements, product);
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
