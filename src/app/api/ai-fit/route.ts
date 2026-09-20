import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { product, measurements } = await request.json();

    if (!product) {
      return NextResponse.json({ error: "Product data is required" }, { status: 400 });
    }

    const { height, weight, bodyType } = measurements || {};

    // Basic heuristic fallback if missing api key or an error occurs
    let fallbackRecommendation = "M";
    let fallbackReasoning = "Based on standard brand sizing.";
    let fallbackConfidence = 75;

    if (height && weight) {
      // Basic heuristic to make it slightly dynamic
      const h = parseFloat(height); // assumes cm
      const w = parseFloat(weight); // assumes kg

      if (!isNaN(h) && !isNaN(w)) {
        if (h > 185 && w > 85) {
            fallbackRecommendation = "XL";
            fallbackReasoning = "Based on your height and weight, XL provides a comfortable fit.";
        } else if (h > 175 && w > 75) {
            fallbackRecommendation = "L";
            fallbackReasoning = "Large is suitable for your measurements in this brand.";
        } else if (h < 165 && w < 60) {
            fallbackRecommendation = "S";
            fallbackReasoning = "Small is recommended for a better fit based on your profile.";
        }
      }
    }

    if (bodyType && fallbackRecommendation !== "XL" && bodyType.toLowerCase().includes("athletic")) {
      fallbackReasoning += " We also considered your athletic build.";
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.warn("No GEMINI_API_KEY found, using fallback algorithm for AI Fit Check.");
        return NextResponse.json({
            size: fallbackRecommendation,
            reasoning: fallbackReasoning,
            confidence: fallbackConfidence
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an expert AI Fit Assistant. Your task is to recommend the best clothing size for a user based on their measurements and the product details.

        Product Details:
        Name: ${product.name || "Unknown"}
        Description: ${product.description || "Unknown"}
        Category: ${product.categoryId || "Unknown"}

        User Measurements:
        Height: ${height || "Not provided"}
        Weight: ${weight || "Not provided"}
        Body Type: ${bodyType || "Not provided"}

        Analyze this information and provide a JSON response with the following keys:
        - "size": The recommended size (e.g., "XS", "S", "M", "L", "XL", "XXL"). If you cannot determine, default to "M".
        - "reasoning": A short 1-2 sentence explanation of why this size is recommended based on the user's measurements and the product type.
        - "confidence": An integer between 0 and 100 representing your confidence in this recommendation.

        Output ONLY valid JSON.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Try to extract JSON from markdown if present
        let cleanText = text;
        const match = text.match(/```json\n([\s\S]*?)\n```/);
        if (match) {
            cleanText = match[1];
        }

        const parsedResult = JSON.parse(cleanText);

        return NextResponse.json({
            size: parsedResult.size || fallbackRecommendation,
            reasoning: parsedResult.reasoning || fallbackReasoning,
            confidence: parsedResult.confidence || fallbackConfidence
        });

    } catch (aiError) {
        console.error("AI Generation Error in AI Fit Check:", aiError);
        // Fallback on AI error
        return NextResponse.json({
            size: fallbackRecommendation,
            reasoning: fallbackReasoning,
            confidence: fallbackConfidence
        });
    }

  } catch (error) {
    console.error("Error in POST /api/ai-fit:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
