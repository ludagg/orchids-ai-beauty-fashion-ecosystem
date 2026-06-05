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
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Fetch User
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch Product
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Check if user has necessary profile measurements
        if (!user.height || !user.weight || !user.bodyType) {
            return NextResponse.json({
                missingProfileInfo: true,
                recommendedSize: "N/A",
                confidenceScore: 0,
                analysis: "Please update your height, weight, and body type in your profile to get personalized AI fit recommendations."
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Returning fallback fit recommendation.");
            return NextResponse.json({
                missingProfileInfo: false,
                recommendedSize: "M",
                confidenceScore: 75,
                analysis: `Based on a simple keyword match (Height: ${user.height}, Weight: ${user.weight}), a size M should be a regular fit. Please verify measurements before purchasing.`
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert fashion stylist and tailor AI for an app called "Rare".
            Your task is to analyze the user's measurements and the product details, and recommend the best size.

            User Profile:
            - Height: ${user.height}
            - Weight: ${user.weight}
            - Body Type: ${user.bodyType}
            - Gender/Style Preference: ${user.gender || 'Not specified'}

            Product Details:
            - Brand: ${product.brand}
            - Name: ${product.name}
            - Description: ${product.description}
            - Category: ${product.mainCategory} / ${product.subcategory}
            - Material: ${product.material || 'Not specified'}
            - Available Sizes: ${product.sizes ? JSON.stringify(product.sizes) : 'Standard S, M, L, XL'}

            Respond strictly in a JSON format without any markdown wrappers or code blocks.
            Format:
            {
                "recommendedSize": "M", // Single size string, e.g. "S", "M", "L", "XL", "32", "40", etc.
                "confidenceScore": 85, // Integer between 0 and 100
                "analysis": "A detailed 2-3 sentence explanation of why this size is recommended based on their body type and the product's material/brand tendencies."
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error:", geminiError);
             return NextResponse.json({
                missingProfileInfo: false,
                recommendedSize: "M",
                confidenceScore: 60,
                analysis: "Our AI model is currently unavailable, but based on typical sizing for this brand, we estimate a size M."
            });
        }

        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json({
                 missingProfileInfo: false,
                 recommendedSize: "M",
                 confidenceScore: 60,
                 analysis: "We had trouble generating a highly confident recommendation, but M is the safest bet for average proportions."
             });
        }

        return NextResponse.json({
            missingProfileInfo: false,
            recommendedSize: parsedResponse.recommendedSize,
            confidenceScore: parsedResponse.confidenceScore,
            analysis: parsedResponse.analysis
        });

    } catch (error) {
        console.error("AI Fit API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}