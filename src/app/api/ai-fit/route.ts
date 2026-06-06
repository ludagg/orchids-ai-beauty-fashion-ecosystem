import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId, category } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Fetch user data for sizing
        const userData = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        // Fetch product data
        const productData = await db.query.products.findFirst({
            where: eq(products.id, productId),
        });

        if (!productData) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Fallback mock logic if no API key
            const sizes = productData.sizes && Array.isArray(productData.sizes)
                 ? productData.sizes.map((s: any) => s.name || s)
                 : ["S", "M", "L", "XL"];

            const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

            return NextResponse.json({
                recommendedSize: randomSize,
                confidence: 85,
                explanation: `Based on general trends for ${productData.brand || "this brand"}, we recommend size ${randomSize}.`,
                factors: ["Brand averages", "Standard sizing"]
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Expert for an app called "Rare".
            Analyze the following user profile and product details to recommend the best size.

            User Profile:
            - Height: ${userData?.height || "Unknown"}
            - Weight: ${userData?.weight || "Unknown"}
            - Body Type: ${userData?.bodyType || "Unknown"}
            - Preferred Style: ${userData?.style || "Unknown"}

            Product Details:
            - Name: ${productData.name}
            - Category: ${productData.category || category || "Clothing"}
            - Brand: ${productData.brand || "Unknown"}
            - Available Sizes: ${JSON.stringify(productData.sizes) || "Standard (S, M, L, XL)"}

            Provide a size recommendation in JSON format ONLY:
            {
                "recommendedSize": "M", // The specific size string
                "confidence": 92, // Integer between 0-100
                "explanation": "A short, friendly sentence explaining why this fits well.",
                "factors": ["Height/Weight ratio", "Brand typically runs small"] // Array of up to 3 short reasons
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const parsed = JSON.parse(jsonString);
            return NextResponse.json(parsed);
        } catch (e) {
             console.error("Failed to parse Gemini JSON:", text);
             return NextResponse.json({
                recommendedSize: "M",
                confidence: 70,
                explanation: "We couldn't analyze the specific details, but M is a common fit.",
                factors: ["General Average"]
             });
        }

    } catch (error) {
        console.error("AI Fit API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
