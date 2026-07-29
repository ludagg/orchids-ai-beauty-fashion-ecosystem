import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function fallbackFitCheck(product: any, measurements: any) {
  // Simple heuristic algorithm based on height and weight for demo purposes
  const height = parseFloat(measurements.height);
  const weight = parseFloat(measurements.weight);

  if (isNaN(height) || isNaN(weight)) {
    return {
      size: "M",
      confidence: 50,
      reasoning: "Basé sur une estimation moyenne due au manque de données précises.",
      fitEstimate: "Regular"
    };
  }

  const bmi = weight / ((height / 100) * (height / 100));
  let size = "M";
  let fitEstimate = "Regular";
  let confidence = 70;

  if (bmi < 18.5) {
    size = "S";
    fitEstimate = "Slightly loose";
  } else if (bmi >= 25 && bmi < 30) {
    size = "L";
    fitEstimate = "Regular to tight";
  } else if (bmi >= 30) {
    size = "XL";
    fitEstimate = "Fitted";
  }

  // Adjust slightly based on body type
  if (measurements.bodyType === "athletic" && size === "M") {
     size = "L"; // Athletic build often needs more shoulder/chest room
     confidence += 5;
  }

  if (measurements.bodyType === "slim" && size === "M") {
     size = "S";
     confidence += 5;
  }

  return {
    size,
    confidence,
    reasoning: `D'après vos mensurations (${height}cm, ${weight}kg) et votre morphologie estimée, la taille ${size} offrira un confort optimal.`,
    fitEstimate,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product, measurements } = body;

    if (!product || !measurements) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "dummy-gemini-key") {
      console.warn("Valid GEMINI_API_KEY is not set. Falling back to heuristic matching.");
      const recommendation = fallbackFitCheck(product, measurements);
      return NextResponse.json(recommendation);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI Fit Assistant for a fashion app. Your task is to recommend the best clothing size for a user based on their measurements and the product details.

      User Measurements:
      - Height: ${measurements.height} cm
      - Weight: ${measurements.weight} kg
      - Body Type: ${measurements.bodyType}

      Product Details:
      - Name: ${product.name}
      - Category: ${product.mainCategory} > ${product.subcategory}
      - Material/Fabric: ${product.material || "Unknown"}
      - Description: ${product.description}

      Available sizes are usually XS, S, M, L, XL, XXL.

      Please provide your recommendation in JSON format exactly like this (in French):
      {
        "size": "M", // The recommended size
        "confidence": 85, // Number from 0 to 100 representing confidence level
        "reasoning": "A short, helpful explanation in French of why this size is recommended based on the user's body type and the garment's fabric/cut.",
        "fitEstimate": "Regular" // A short description of how it will fit (e.g., "Regular", "Serré", "Ample", "Ajusté")
      }

      Return ONLY the JSON. No markdown formatting or extra text.
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
      return NextResponse.json(fallbackFitCheck(product, measurements));
    }
  } catch (error) {
    console.error("AI Fit Check Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
