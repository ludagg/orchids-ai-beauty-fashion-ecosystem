import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { height, weight, bodyType, brand, category, fitPreference } = await req.json();

        // 1. Fallback heuristic if API key is missing or fails
        const getFallbackRecommendation = () => {
            const numWeight = parseInt(weight);
            if (isNaN(numWeight)) return { recommendedSize: "M", confidence: 60, explanation: "Based on standard sizing averages." };

            if (numWeight < 60) return { recommendedSize: "S", confidence: 75, explanation: "Based on standard S sizing for your weight bracket." };
            if (numWeight > 85) return { recommendedSize: "L", confidence: 75, explanation: "Based on standard L sizing for your weight bracket." };
            return { recommendedSize: "M", confidence: 80, explanation: "Based on standard M sizing for your weight bracket." };
        };

        if (!process.env.GEMINI_API_KEY) {
             console.warn("GEMINI_API_KEY not found. Using fallback heuristic for AI Fit Check.");
             return NextResponse.json(getFallbackRecommendation());
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            Act as an expert virtual fashion stylist and sizing assistant.
            Analyze the following user measurements and product details to recommend the best clothing size.

            User Details:
            - Height: ${height || 'Not provided'}
            - Weight: ${weight || 'Not provided'}
            - Body Type: ${bodyType || 'Not provided'}

            Product Details:
            - Brand: ${brand || 'Generic'}
            - Category: ${category || 'Clothing'}
            - User's Fit Preference: ${fitPreference || 'Regular fit'}

            Based on standard fashion industry sizing charts and brand tendencies, predict the best size (XS, S, M, L, XL, XXL).
            Provide a confidence score (0-100) and a brief 1-2 sentence explanation.

            Return ONLY a JSON object with this exact structure:
            {
              "recommendedSize": "M",
              "confidence": 85,
              "explanation": "Brief explanation here."
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        try {
            // Clean markdown formatting if present
            const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonResponse = JSON.parse(cleanedText);

            // Validate expected structure
            if (!jsonResponse.recommendedSize || !jsonResponse.explanation) {
                 throw new Error("Invalid response format from AI");
            }

            return NextResponse.json({
                recommendedSize: jsonResponse.recommendedSize,
                confidence: jsonResponse.confidence || 70,
                explanation: jsonResponse.explanation
            });

        } catch (parseError) {
            console.error("Failed to parse AI response:", parseError, "Raw text:", responseText);
            return NextResponse.json(getFallbackRecommendation());
        }

    } catch (error) {
        console.error("Error in AI Fit Check route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
