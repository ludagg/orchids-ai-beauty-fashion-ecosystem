import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType } = await req.json();

    if (!image || !mimeType) {
      return NextResponse.json({ error: "Image and mimeType are required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set.");
      return NextResponse.json({ error: "AI Service not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use the flash model which is faster and supports vision
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert fashion, beauty, and lifestyle assistant for an e-commerce platform called Rare (formerly Priisme).
      Your task is to analyze the provided image and extract relevant search keywords.

      Focus on identifying:
      - Clothing items (e.g., "red floral dress", "leather jacket", "denim jeans")
      - Beauty or hair styles (e.g., "balayage", "red lipstick", "fade haircut")
      - Accessories (e.g., "gold necklace", "sunglasses")
      - General style/vibe (e.g., "vintage", "streetwear", "elegant")

      Return ONLY a JSON array of 2 to 4 highly relevant keywords as strings.
      Do not include any markdown formatting, backticks, or explanation. Just the raw JSON array.

      Example valid output:
      ["red floral dress", "summer", "vintage"]
    `;

    const imageParts = [
      {
        inlineData: {
          data: image,
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();

    // Clean up potential markdown from the response
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    let keywords: string[] = [];
    try {
        keywords = JSON.parse(cleanedText);
        if (!Array.isArray(keywords)) {
             keywords = [cleanedText]; // fallback if not an array
        }
    } catch (e) {
        console.error("Failed to parse Gemini response as JSON:", cleanedText);
        // Fallback: try to split by commas or newlines if JSON parsing fails
        keywords = cleanedText.split(/[\n,]/).map(k => k.trim().replace(/['"]/g, '')).filter(k => k.length > 0);
    }

    return NextResponse.json({ keywords: keywords.slice(0, 4) });

  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
