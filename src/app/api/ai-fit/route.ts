import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { productId, userProfile } = await req.json();

    if (!productId || !userProfile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
        You are an AI Fit Check assistant for a clothing store.
        User profile:
        - Height: ${userProfile.height}
        - Weight: ${userProfile.weight}
        - Body Type: ${userProfile.bodyType}

        Determine the best size for this user.
        Return ONLY a JSON response in the following format, with no markdown code blocks:
        {
          "recommendedSize": "S|M|L|XL",
          "confidence": number (0-100),
          "reasoning": "brief explanation",
          "fit": "tight|regular|loose"
        }
      `;

      try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Try to parse the response, handling potential markdown wrappers
        const cleanedText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const aiData = JSON.parse(cleanedText);

        if (aiData.recommendedSize && aiData.confidence) {
          return NextResponse.json(aiData);
        }
      } catch (aiError) {
        console.error("AI Generation Error:", aiError);
        // Fallback below
      }
    }

    // Local heuristic fallback algorithm if API key missing or generation failed
    const heightMatch = userProfile.height ? parseInt(userProfile.height) : 170;
    const weightMatch = userProfile.weight ? parseInt(userProfile.weight) : 70;

    let recommendedSize = 'M';
    if (heightMatch > 180 || weightMatch > 85) recommendedSize = 'L';
    if (heightMatch > 190 || weightMatch > 100) recommendedSize = 'XL';
    if (heightMatch < 165 && weightMatch < 60) recommendedSize = 'S';

    let fit = 'regular';
    if (userProfile.bodyType?.toLowerCase().includes('athletic')) fit = 'tight';
    if (userProfile.bodyType?.toLowerCase().includes('curvy')) fit = 'loose';

    return NextResponse.json({
      recommendedSize,
      confidence: 75,
      reasoning: `Based on your height (${userProfile.height}) and weight (${userProfile.weight}), we recommend size ${recommendedSize}.`,
      fit,
      isFallback: true
    });

  } catch (error: any) {
    console.error("AI Fit API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
