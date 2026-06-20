import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { product } = body;

        if (!product) {
            return NextResponse.json({ error: "Product is required" }, { status: 400 });
        }

        // Fetch user's physical attributes
        const userData = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: {
                height: true,
                weight: true,
                bodyType: true
            }
        });

        if (!userData || (!userData.height && !userData.weight && !userData.bodyType)) {
             return NextResponse.json({
                 recommendedSize: null,
                 confidence: 0,
                 reasoning: "We need your height and weight to provide a size recommendation. Please update your profile."
             });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Fallback algorithm
            console.warn("GEMINI_API_KEY is not set. Falling back to simple sizing logic.");

            let recommendedSize = "M"; // Default fallback
            let reasoning = "Based on general averages, M is a common fit.";
            let confidence = 40;

            if (userData.weight && userData.height) {
                const weight = parseInt(userData.weight);
                const height = parseInt(userData.height);

                if (!isNaN(weight) && !isNaN(height)) {
                    if (weight < 60 && height < 170) {
                        recommendedSize = "S";
                        reasoning = "Based on your height and weight, a smaller size is typically the best fit.";
                        confidence = 65;
                    } else if (weight > 80 || height > 185) {
                        recommendedSize = "L";
                        reasoning = "Based on your height and weight, a larger size will likely be more comfortable.";
                        confidence = 65;
                    } else {
                        recommendedSize = "M";
                        reasoning = "Your measurements fall into our standard medium range for this brand.";
                        confidence = 70;
                    }
                }
            }

            return NextResponse.json({
                recommendedSize,
                confidence,
                reasoning
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert AI Fit Assistant for a fashion app.
            Your goal is to recommend the best clothing size for a user and explain why.

            User Profile:
            - Height: ${userData.height || "Not provided"}
            - Weight: ${userData.weight || "Not provided"}
            - Body Type: ${userData.bodyType || "Not provided"}

            Product Information:
            - Name: ${product.name || "Unknown"}
            - Brand: ${product.brand || "Unknown"}
            - Description: ${product.description || "None"}
            - Available Sizes: ${product.sizes ? JSON.stringify(product.sizes) : "S, M, L, XL"}

            Analyze the user's measurements against the product's likely fit (considering the brand and description).
            If exact sizes aren't available, assume standard S, M, L, XL.
            Provide a confidence score between 0 and 100.

            Return ONLY a JSON object with this structure (no markdown code blocks):
            {
                "recommendedSize": "M",
                "confidence": 85,
                "reasoning": "Based on your height of 175cm and weight of 70kg, size M from this brand should offer a comfortable, regular fit."
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error:", geminiError);
            return NextResponse.json({ error: "Failed to generate recommendation" }, { status: 500 });
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();

        try {
            const parsedResponse = JSON.parse(jsonString);
            return NextResponse.json(parsedResponse);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json({ error: "Failed to parse recommendation" }, { status: 500 });
        }

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
