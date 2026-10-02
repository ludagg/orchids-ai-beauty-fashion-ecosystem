import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, height, weight, bodyType } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        let recommendedSize = "M"; // Fallback
        let explanation = "Based on general preferences, we recommend size M. Please update your profile with your measurements for a personalized fit.";
        let matchScore = 80;

        if (apiKey && height && weight && bodyType) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `
                    You are an expert fashion stylist AI.
                    Analyze the fit for a customer looking at a "${product.name}" (${product.category || "clothing"}).
                    Customer measurements:
                    - Height: ${height}
                    - Weight: ${weight}
                    - Body Type: ${bodyType}

                    Available sizes are typically XS, S, M, L, XL, XXL.

                    Return ONLY a JSON object (no markdown) with:
                    {
                        "recommendedSize": "The recommended size (e.g., M)",
                        "explanation": "A short, friendly explanation (max 2 sentences) of why this size fits their body type.",
                        "matchScore": an integer from 0 to 100 representing confidence
                    }
                `;

                const result = await model.generateContent(prompt);
                const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
                const parsed = JSON.parse(text);

                recommendedSize = parsed.recommendedSize || recommendedSize;
                explanation = parsed.explanation || explanation;
                matchScore = parsed.matchScore || matchScore;
            } catch (aiError) {
                console.error("AI Fit generation error:", aiError);
                // Keep the fallback
                if (height && weight) {
                     explanation = `Based on your height (${height}) and weight (${weight}), we estimate size M would be a good fit, though our AI assistant is currently unavailable for deeper analysis.`;
                }
            }
        } else if (height || weight || bodyType) {
             explanation = `We see partial measurements. For best results, fill out your complete profile. For now, M is our standard recommendation.`;
        }

        return NextResponse.json({
            recommendedSize,
            explanation,
            matchScore
        });

    } catch (error) {
        console.error("AI Fit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
