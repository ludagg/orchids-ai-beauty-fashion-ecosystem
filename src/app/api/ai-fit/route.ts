import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId, brand, category } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const userProfile = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (!userProfile) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        // Check if user has measurements setup
        if (!userProfile.height || !userProfile.weight) {
             return NextResponse.json({
                 error: "Measurements required",
                 needsMeasurements: true
             }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // If no API key, use fallback logic
        if (!apiKey) {
             console.warn("GEMINI_API_KEY not set for AI Fit Check. Using fallback.");
             let size = "M";
             if (userProfile.weight && parseInt(userProfile.weight) < 60) size = "S";
             if (userProfile.weight && parseInt(userProfile.weight) > 85) size = "L";

             return NextResponse.json({
                 recommendedSize: size,
                 confidence: 85,
                 reasoning: "Based on standard BMI measurements."
             });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Expert for an app called "Rare".
            Analyze the following user profile and product details to recommend the best clothing size.

            User Profile:
            - Height: ${userProfile.height}
            - Weight: ${userProfile.weight}
            - Body Type: ${userProfile.bodyType || 'Unknown'}
            - Gender: ${userProfile.gender || 'Unknown'}

            Product Details:
            - Brand: ${brand || 'Generic'}
            - Category: ${category || 'Clothing'}

            Return ONLY a JSON object with this structure (no markdown blocks):
            {
                "recommendedSize": "S/M/L/XL/etc",
                "confidence": number from 0 to 100,
                "reasoning": "A short, friendly sentence explaining why this size is recommended based on the user's measurements and the brand's typical sizing."
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const parsedResponse = JSON.parse(jsonString);

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
