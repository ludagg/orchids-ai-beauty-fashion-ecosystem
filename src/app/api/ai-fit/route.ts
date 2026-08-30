import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenerativeModel = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { height, weight, bodyType, product } = body;

        if (!product) {
             return NextResponse.json({ error: "Product information is required" }, { status: 400 });
        }

        // Local Fallback Algorithm
        const fallbackRecommendation = () => {
             let recommendedSize = "M"; // Default to M
             let fitDescription = "This item has a standard fit. Based on average profiles, size M should work well.";
             let confidenceScore = 60;

             if (height && weight) {
                  // Basic BMI-like heuristic
                  const hInMeters = parseFloat(height) / 100;
                  const bmi = parseFloat(weight) / (hInMeters * hInMeters);

                  if (bmi < 18.5) {
                      recommendedSize = "S";
                      fitDescription = "Based on your measurements, size S will likely provide a nice, regular fit.";
                      confidenceScore = 75;
                  } else if (bmi >= 25 && bmi < 30) {
                      recommendedSize = "L";
                      fitDescription = "Based on your measurements, size L should offer a comfortable fit.";
                      confidenceScore = 75;
                  } else if (bmi >= 30) {
                      recommendedSize = "XL";
                      fitDescription = "Based on your measurements, size XL is recommended for a comfortable fit.";
                      confidenceScore = 75;
                  } else {
                      recommendedSize = "M";
                      fitDescription = "Based on your measurements, size M is the optimal choice for a standard fit.";
                      confidenceScore = 80;
                  }
             }

             if (bodyType && bodyType.toLowerCase() === 'athletic') {
                 fitDescription += " It might be a bit snug around the shoulders due to your athletic build.";
             }

             // Adjust based on product category if possible
             if (product.category && typeof product.category === 'string') {
                  const cat = product.category.toLowerCase();
                  if (cat.includes('jacket') || cat.includes('coat')) {
                      fitDescription += " You might want to consider sizing up if you plan to wear thick layers underneath.";
                  }
             }

             return NextResponse.json({
                recommendedSize,
                fitDescription,
                confidenceScore,
                source: 'local-fallback'
            });
        };

        const model = getGenerativeModel();

        if (!model) {
            console.warn("GEMINI_API_KEY is not set. Using local fallback algorithm for AI Fit Check.");
            return fallbackRecommendation();
        }

        const prompt = `
            You are an expert AI Fit Assistant for a fashion app.
            Your goal is to recommend the best clothing size and describe the fit for a user based on their measurements and the product details.

            User Profile:
            - Height: ${height || 'Not provided'}
            - Weight: ${weight || 'Not provided'}
            - Body Type: ${bodyType || 'Not provided'}

            Product Details:
            - Name: ${product.name || 'Unknown'}
            - Category: ${product.category || 'Unknown'}
            - Description: ${product.description || 'None'}

            Based on this information, provide:
            1. A recommended size (e.g., XS, S, M, L, XL, XXL). If there is not enough user data to make a confident guess, default to M.
            2. A brief, helpful description of how the item will likely fit (e.g., "Will have a relaxed fit on the shoulders").
            3. A confidence score between 0 and 100 representing how sure you are of this recommendation (e.g., 85). If no user data is provided, the score should be low (e.g., 40).

            Return ONLY a JSON object with this exact structure (no markdown code blocks, no extra text):
            {
                "recommendedSize": "M",
                "fitDescription": "Short description here",
                "confidenceScore": 85
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error in AI Fit Check:", geminiError);
            return fallbackRecommendation();
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response for AI Fit Check:", text);
            return fallbackRecommendation();
        }

        return NextResponse.json({
            ...parsedResponse,
            source: 'gemini'
        });

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}