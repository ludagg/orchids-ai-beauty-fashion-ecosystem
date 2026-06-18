import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
        }

        const body = await req.json();
        const { productId, productName, brand, category } = body;

        if (!productId || !productName) {
            return NextResponse.json({ error: "Missing product information" }, { status: 400 });
        }

        // Fetch user measurements from DB
        const userRec = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: {
                height: true,
                weight: true,
                bodyType: true,
                gender: true
            }
        });

        if (!userRec || (!userRec.height && !userRec.weight && !userRec.bodyType)) {
             return NextResponse.json({
                 error: "Profile measurements missing. Please update your profile with height, weight, and body type for accurate recommendations."
             }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Fallback mock logic if no API key
            return NextResponse.json({
                recommendation: {
                    size: "M",
                    confidence: 85,
                    explanation: "Based on your general profile, M is the most common size for this fit. (Mock Data - No AI Key)"
                }
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert AI Fashion Fit Consultant.

            User Profile:
            - Height: ${userRec.height || 'Not provided'}
            - Weight: ${userRec.weight || 'Not provided'}
            - Body Type: ${userRec.bodyType || 'Not provided'}
            - Gender: ${userRec.gender || 'Not provided'}

            Product Details:
            - Name: ${productName}
            - Brand: ${brand || 'Generic'}
            - Category: ${category || 'Clothing'}

            Task: Based on these measurements and typical sizing for this type of product, determine the best clothing size for the user (e.g., XS, S, M, L, XL, XXL or numerical like 32, 34 etc if applicable).

            Return ONLY a valid JSON object matching exactly this structure:
            {
                "size": "The recommended size (e.g. M)",
                "confidence": a number between 50 and 99 representing your confidence,
                "explanation": "A friendly 1-2 sentence explanation of why this size is recommended based on their specific measurements and the product type."
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        let recommendation;
        try {
            recommendation = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse AI response:", responseText);
            // Fallback
            recommendation = {
                size: "M",
                confidence: 75,
                explanation: "We couldn't generate a highly confident prediction, but M is a safe average based on typical sizing."
            };
        }

        return NextResponse.json({ recommendation });

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}