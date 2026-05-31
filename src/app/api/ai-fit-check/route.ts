import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Fetch user measurements
        const userProfile = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: {
                height: true,
                weight: true,
                bodyType: true,
                gender: true
            }
        });

        if (!userProfile) {
             return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        // Fetch product details
        const productInfo = await db.query.products.findFirst({
            where: eq(products.id, productId),
            columns: {
                name: true,
                brand: true,
                description: true,
                mainCategory: true,
                subcategory: true,
                sizes: true,
                dimensions: true
            }
        });

        if (!productInfo) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to default recommendation.");
            return NextResponse.json({
                 recommendedSize: "M",
                 explanation: "Based on standard sizing models.",
                 confidence: 50,
                 fitType: "regular"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert AI Fit Assistant. Analyze the following user measurements and product details to recommend the best size.

            User Profile:
            - Height: ${userProfile.height || "Not specified"}
            - Weight: ${userProfile.weight || "Not specified"}
            - Body Type: ${userProfile.bodyType || "Not specified"}
            - Gender: ${userProfile.gender || "Not specified"}

            Product Details:
            - Name: ${productInfo.name}
            - Brand: ${productInfo.brand}
            - Category: ${productInfo.mainCategory} > ${productInfo.subcategory}
            - Available Sizes: ${JSON.stringify(productInfo.sizes || [])}
            - Description: ${productInfo.description}

            Determine the recommended size for this user (e.g., XS, S, M, L, XL, XXL, or a specific number depending on the sizes available).
            Also predict the fit type (tight, regular, oversized) and provide a short explanation (1-2 sentences max).

            Return ONLY a valid JSON object with the following structure:
            {
                "recommendedSize": "string",
                "explanation": "string",
                "confidence": number (1-100),
                "fitType": "tight" | "regular" | "oversized"
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error (Fit Check):", geminiError);
            return NextResponse.json({
                 recommendedSize: "M",
                 explanation: "Could not generate precise recommendation at this time.",
                 confidence: 50,
                 fitType: "regular"
            });
        }

        const responseText = result.response.text();
        const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response for Fit Check:", responseText);
             return NextResponse.json({
                 recommendedSize: "M",
                 explanation: "Could not parse AI response.",
                 confidence: 50,
                 fitType: "regular"
            });
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
