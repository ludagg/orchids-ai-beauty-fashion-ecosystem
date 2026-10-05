import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function fallbackRecommendation(measurements: any, product: any) {
  if (!measurements || (!measurements.height && !measurements.weight && !measurements.bodyType)) {
    return {
      size: "M",
      confidence: 50,
      reasoning: "We don't have your measurements yet. Based on average sizing for this brand, M is a safe bet, but please update your profile for better recommendations.",
      fitType: "regular",
    };
  }

  // Very simple algorithmic fallback
  let size = "M";
  if (measurements.weight) {
    const w = parseInt(measurements.weight);
    if (w < 60) size = "S";
    else if (w > 85) size = "L";
    else if (w > 100) size = "XL";
  }

  return {
    size,
    confidence: 65,
    reasoning: `Based on your weight (${measurements.weight}kg) and body type (${measurements.bodyType || 'average'}), size ${size} should provide a comfortable fit for ${product.name || 'this item'}.`,
    fitType: "regular",
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Optionally require auth, but let's allow unauthenticated if we just use passed measurements
    const body = await req.json();
    const { measurements, product } = body;

    if (!product) {
      return NextResponse.json({ error: "Product data is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Falling back to algorithmic recommendation.");
      return NextResponse.json(fallbackRecommendation(measurements, product));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Sanitize user inputs to prevent injection
    const sanitize = (str: string | undefined | null) => str ? String(str).replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50) : 'unknown';
    const height = sanitize(measurements?.height);
    const weight = sanitize(measurements?.weight);
    const bodyType = sanitize(measurements?.bodyType);

    const prompt = `
      You are an expert AI Fashion Stylist and Tailor.
      Your task is to analyze the user's body measurements and a specific product's details to recommend the best size.

      User Profile:
      - Height: ${height}
      - Weight: ${weight}
      - Body Type: ${bodyType}

      Product Details:
      - Name: ${product.name}
      - Description: ${product.description}
      - Category: ${product.category}
      - Brand: ${product.brand}

      Based on this information, provide a size recommendation.
      Assume standard US/EU sizing if not specified.
      Provide a confidence score (0-100) and a brief, friendly explanation.
      Also specify the expected fit type (e.g., tight, regular, loose).

      Return ONLY a JSON object with this exact structure (no markdown code blocks):
      {
        "size": "The recommended size (e.g., XS, S, M, L, XL, XXL)",
        "confidence": 85,
        "reasoning": "A short 1-2 sentence explanation tailored to the user",
        "fitType": "tight" | "regular" | "loose"
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsedResponse = JSON.parse(jsonString);
      return NextResponse.json(parsedResponse);
    } catch (geminiError) {
      console.error("Gemini API Error for Fit Check:", geminiError);
      return NextResponse.json(fallbackRecommendation(measurements, product));
    }

  } catch (error) {
    console.error("AI Fit Check Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
