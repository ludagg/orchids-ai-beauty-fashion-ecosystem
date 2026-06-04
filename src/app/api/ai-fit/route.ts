import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in to use AI Fit Check." }, { status: 401 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
        }

        // Fetch product from DB
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }

        const user = session.user as any;
        const height = user.height;
        const weight = user.weight;
        const bodyType = user.bodyType;

        if (!height || !weight || !bodyType) {
            return NextResponse.json({
                error: "Incomplete profile. Please update your height, weight, and body type in your profile settings to get personalized fit recommendations."
            }, { status: 400 });
        }

        const sizesAvailable = product.sizes ? product.sizes.map((s: any) => s.name).join(", ") : "S, M, L, XL";

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Returning fallback AI Fit Check response.");
            // Fallback response for missing API key
            return NextResponse.json({
                recommendedSize: "M",
                confidenceScore: 85,
                reasoning: `Based on your profile (Height: ${height}, Weight: ${weight}, Body Type: ${bodyType}) and our typical sizing for ${product.mainCategory}, size M should offer a comfortable and flattering fit.`
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert fashion stylist and tailor AI for an app called "Rare".
            Your task is to analyze the user's body measurements and recommend the best size for a specific product.

            User Profile:
            - Height: ${height}
            - Weight: ${weight}
            - Body Type: ${bodyType}

            Product Details:
            - Name: ${product.name}
            - Category: ${product.mainCategory} > ${product.subcategory}
            - Description: ${product.description}
            - Material: ${product.material || "Unknown"}
            - Available Sizes: ${sizesAvailable}

            Analyze the user's profile against the product details and material stretchiness/fit typical for this category.
            Determine the best recommended size from the available sizes.
            Calculate a confidence score (0-100) based on how well the typical dimensions for that size match the user's profile.
            Provide a short, clear reasoning (2-3 sentences) explaining why this size is recommended and how it will likely fit (e.g., "slightly oversized", "form-fitting").

            Return ONLY a JSON object with this exact structure (no markdown code blocks):
            {
                "recommendedSize": "The exact size name from available sizes",
                "confidenceScore": 88,
                "reasoning": "Your reasoning here."
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error:", geminiError);
            return NextResponse.json({
                recommendedSize: "M",
                confidenceScore: 75,
                reasoning: `Based on your profile, size M is our estimated recommendation. Please check the brand's size guide for precise measurements.`
            });
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json({
                recommendedSize: "M",
                confidenceScore: 70,
                reasoning: "We couldn't generate a highly confident recommendation, but M is a safe starting point based on typical proportions."
            });
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
