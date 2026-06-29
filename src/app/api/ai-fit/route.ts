import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Optionnel: on peut permettre aux visiteurs de l'utiliser s'ils remplissent le formulaire sans être co
    // Mais pour l'instant on va dire qu'on les laisse, et on prend juste le session.user.id s'il y en a un.

    const body = await req.json();
    const { height, weight, bodyType, brand, productName, availableSizes } = body;

    if (!height || !weight || !bodyType) {
        return NextResponse.json({ error: "Missing measurements" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Falling back to simple algorithm.");
      return fallbackSizing(height, weight, bodyType, availableSizes);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI Fashion Stylist and Size Recommender for an app called "Rare".
      Your goal is to recommend the best clothing size for a user based on their measurements.

      User Measurements:
      - Height: ${height}
      - Weight: ${weight}
      - Body Type: ${bodyType}

      Product Information:
      - Brand: ${brand || "Unknown Brand"}
      - Product Name: ${productName || "Clothing Item"}
      - Available Sizes: ${JSON.stringify(availableSizes || [])}

      Task:
      1. Analyze the user's measurements and the product details.
      2. Determine the most suitable size from the "Available Sizes". If no sizes are provided, guess the standard size (S, M, L, XL, etc.).
      3. Provide a confidence score out of 100.
      4. Give a short, helpful explanation (1-2 sentences max) to the user about why this size is recommended (e.g., "Based on your height and weight, this should offer a comfortable, regular fit.").

      Return ONLY a JSON object with this exact structure (no markdown code blocks, just raw JSON):
      {
          "recommendedSize": "M",
          "confidenceScore": 85,
          "explanation": "Based on your measurements, size M will provide a comfortable fit for this brand."
      }
    `;

    let result;
    try {
        result = await model.generateContent(prompt);
    } catch (geminiError) {
        console.error("Gemini API Error for AI Fit Check:", geminiError);
        return fallbackSizing(height, weight, bodyType, availableSizes);
    }

    const response = result.response;
    const text = response.text();
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedResponse;
    try {
        parsedResponse = JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse Gemini AI Fit Check response:", text);
        return fallbackSizing(height, weight, bodyType, availableSizes);
    }

    // Ensure recommendedSize is in availableSizes if provided
    let finalSize = parsedResponse.recommendedSize;
    if (availableSizes && availableSizes.length > 0) {
       const sizeNames = availableSizes.map((s: any) => typeof s === 'string' ? s : s.name);
       if (!sizeNames.includes(finalSize)) {
            // Find closest match or just pick a middle one if not found
            finalSize = fallbackSizingLogic(height, weight, sizeNames);
            parsedResponse.recommendedSize = finalSize;
       }
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("AI Fit Check Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function fallbackSizingLogic(heightStr: string, weightStr: string, sizes: string[] = ['S', 'M', 'L', 'XL']) {
    let weight = parseInt(weightStr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(weight)) weight = 70; // Default

    let size = 'M';
    if (weight < 60) size = 'S';
    else if (weight >= 60 && weight < 75) size = 'M';
    else if (weight >= 75 && weight < 90) size = 'L';
    else size = 'XL';

    // Ensure it exists in available sizes
    if (sizes.length > 0 && !sizes.includes(size)) {
        size = sizes[Math.floor(sizes.length / 2)]; // pick middle
    }
    return size;
}

function fallbackSizing(height: string, weight: string, bodyType: string, availableSizes: any[]) {
    const sizeNames = availableSizes ? availableSizes.map((s: any) => typeof s === 'string' ? s : s.name) : ['S', 'M', 'L', 'XL'];
    const size = fallbackSizingLogic(height, weight, sizeNames);

    return NextResponse.json({
        recommendedSize: size,
        confidenceScore: 75,
        explanation: "Based on our standard sizing chart for your height and weight, this should be a good fit."
    });
}
