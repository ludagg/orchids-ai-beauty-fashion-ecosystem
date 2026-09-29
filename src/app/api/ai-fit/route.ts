import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function fallbackFitCheck(measurements: any, product: any) {
  const { height, weight, bodyType } = measurements;
  const h = parseInt(height);
  const w = parseInt(weight);

  let recommendedSize = "M";
  let confidence = 75;
  let rationale = "Based on general averages for this brand.";
  let fitPrediction = "Regular";

  if (w && h) {
    if (w < 60) {
      recommendedSize = "S";
      confidence = 80;
      rationale = "Given your weight, a small usually provides the best fit.";
    } else if (w > 85) {
      recommendedSize = "L";
      confidence = 80;
      rationale = "A large will likely be more comfortable and proportionate.";
    } else {
      recommendedSize = "M";
      confidence = 85;
      rationale = "Medium aligns well with average height-weight ratios.";
    }
  }

  if (bodyType === "Athletic") {
    fitPrediction = "Tight";
  } else if (bodyType === "Curvy") {
    fitPrediction = "Snug";
  }

  return NextResponse.json({
    recommendedSize,
    confidence,
    rationale,
    fitPrediction
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { measurements, product } = body;

    if (!measurements || !product) {
      return NextResponse.json({ error: "Measurements and product details are required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Falling back to simple algorithm.");
      return fallbackFitCheck(measurements, product);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI Fit Assistant for a fashion app called "Rare".
      Your goal is to recommend the best clothing size for a user and predict how it will fit.

      User Measurements:
      - Height: ${measurements.height || "Not provided"}
      - Weight: ${measurements.weight || "Not provided"}
      - Body Type: ${measurements.bodyType || "Not provided"}

      Product Details:
      - Name: ${product.name || "Unknown"}
      - Brand: ${product.brand || "Unknown"}
      - Category: ${product.category || "Unknown"}
      - Description: ${product.description || "None"}
      - Available Sizes: ${product.sizes ? product.sizes.map((s: any) => s.name).join(", ") : "S, M, L"}

      Based on this information, provide:
      1. The recommended size from the available sizes.
      2. A confidence score out of 100.
      3. A short, friendly rationale for the recommendation (1-2 sentences).
      4. A fit prediction (e.g., "Regular", "Tight", "Loose", "Oversized", "Snug").

      Sanitize the input to ensure safety.

      Return ONLY a JSON object with this structure (no markdown code blocks):
      {
          "recommendedSize": "S/M/L/etc",
          "confidence": 85,
          "rationale": "Your explanation here",
          "fitPrediction": "Regular"
      }
    `;

    // Basic prompt injection prevention/sanitization on the input fields
    const safePrompt = prompt.replace(/<[^>]*>?/gm, '');

    let result;
    try {
      result = await model.generateContent(safePrompt);
    } catch (geminiError) {
      console.error("Gemini API Error:", geminiError);
      return fallbackFitCheck(measurements, product);
    }

    const response = result.response;
    const text = response.text();
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini response:", text);
      return fallbackFitCheck(measurements, product);
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("AI Fit Check Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
