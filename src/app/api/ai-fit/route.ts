import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

        const product = await db.query.products.findFirst({
             where: eq(products.id, productId)
        });

        if (!product) {
             return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        });

        const apiKey = process.env.GEMINI_API_KEY;

        let recommendedSize = "M"; // Default fallback
        let explanation = "Based on general brand sizing, we recommend this size.";
        let confidenceScore = 70;

        if (apiKey && user && (user.height || user.weight || user.bodyType)) {
             try {
                 const genAI = new GoogleGenerativeAI(apiKey);
                 const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                 const prompt = `
                    You are an expert AI Fit Assistant. Your job is to recommend the best clothing size for a user based on their profile and the product details.

                    User Profile:
                    - Height: ${user.height || "Unknown"}
                    - Weight: ${user.weight || "Unknown"}
                    - Body Type: ${user.bodyType || "Unknown"}
                    - Preferred Style: ${user.style || "Unknown"}

                    Product Details:
                    - Name: ${product.name}
                    - Brand: ${product.brand}
                    - Category: ${product.mainCategory}
                    - Material: ${product.material || "Unknown"}
                    - Description: ${product.description}
                    - Available Sizes: ${product.sizes ? JSON.stringify(product.sizes) : "S, M, L, XL"}

                    Please analyze this information and provide:
                    1. The recommended size (e.g., S, M, L, XL, etc.)
                    2. A short explanation (max 2 sentences) of why this size is recommended (e.g., "The fabric is stretchy, so sizing down will give a fitted look.").
                    3. A confidence score between 0 and 100.

                    Return ONLY a JSON object with this structure:
                    {
                        "recommendedSize": "Size",
                        "explanation": "Short reason",
                        "confidenceScore": 85
                    }
                 `;

                 const result = await model.generateContent(prompt);
                 const text = result.response.text();
                 const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

                 const parsed = JSON.parse(jsonString);
                 recommendedSize = parsed.recommendedSize || recommendedSize;
                 explanation = parsed.explanation || explanation;
                 confidenceScore = parsed.confidenceScore || confidenceScore;

             } catch (error) {
                 console.error("Gemini API Error in AI Fit Check:", error);
                 // Fallback to default values set above
             }
        } else if (!user?.height && !user?.weight && !user?.bodyType) {
            explanation = "Update your profile with your height, weight, and body type for a personalized size recommendation.";
            confidenceScore = 0;
        }

        return NextResponse.json({
            recommendedSize,
            explanation,
            confidenceScore
        });

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
