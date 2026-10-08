import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { product } = body;

        if (!product) {
            return NextResponse.json({ error: "Product information is required" }, { status: 400 });
        }

        // Ideally, we would fetch user measurements from DB here.
        // For MVP, we will mock them or use generic assumptions if none exist.
        // Let's assume some basic profile data for the AI to process.
        const mockUserProfile = {
             height: "5'8\"",
             weight: "150 lbs",
             bodyType: "athletic",
             preferredFit: "regular"
        };

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Using fallback logic for AI Fit Check.");

            // Basic fallback logic
            const sizes = product.sizes?.map((s: any) => s.name) || ["S", "M", "L"];
            const fallbackSize = sizes.includes("M") ? "M" : sizes[0];

            return NextResponse.json({
                recommendedSize: fallbackSize || "Unknown",
                explanation: "Based on standard sizing, M usually offers a good fit. (Fallback Mode - No AI API Key)",
                confidenceScore: 75
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Assistant for an app called "Rare".
            Your goal is to recommend the best size for a user based on their measurements and the product details.

            User Profile:
            - Height: ${mockUserProfile.height}
            - Weight: ${mockUserProfile.weight}
            - Body Type: ${mockUserProfile.bodyType}
            - Preferred Fit: ${mockUserProfile.preferredFit}

            Product Details:
            - Name: "${product.name}"
            - Description: "${product.description}"
            - Brand: "${product.brand}"
            - Category: "${product.category}"
            - Available Sizes: ${JSON.stringify(product.sizes?.map((s: any) => s.name) || [])}

            Please analyze the user's profile and product details to determine the best size.
            Return a JSON object with this structure (no markdown blocks, just the pure JSON string):
            {
                "recommendedSize": "The size string (e.g. 'M')",
                "explanation": "A short, 1-2 sentence explanation of why this size is recommended based on their height/weight and the product style.",
                "confidenceScore": 85
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error in AI Fit:", geminiError);
            return NextResponse.json({ error: "Failed to generate fit recommendation with AI." }, { status: 500 });
        }

        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response for AI Fit:", text);
            return NextResponse.json({ error: "Invalid response from AI." }, { status: 500 });
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
