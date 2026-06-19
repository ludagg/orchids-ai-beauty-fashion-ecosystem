import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function fallbackMatching(userMeasurements: any, product: any) {
  // Simple heuristic fallback if Gemini is not available
  const sizes = product.sizes || [];
  if (!sizes || sizes.length === 0) {
    return NextResponse.json({
        recommendedSize: "One Size",
        confidence: 50,
        reasoning: "This product appears to be one-size-fits-all."
    });
  }

  // Very naive matching for fallback
  const availableSizes = sizes.map((s: any) => s.name);
  let recommendedSize = availableSizes[Math.floor(availableSizes.length / 2)] || availableSizes[0];

  if (userMeasurements.bodyType === "athletic" && availableSizes.includes("L")) recommendedSize = "L";
  if (userMeasurements.bodyType === "slim" && availableSizes.includes("S")) recommendedSize = "S";

  return NextResponse.json({
    recommendedSize,
    confidence: 65,
    reasoning: "Based on basic profiling matching against standard sizing charts for this brand."
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Fetch user measurements
    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        height: true,
        weight: true,
        bodyType: true,
        gender: true
      }
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Fetch product details
    const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
        columns: {
            id: true,
            name: true,
            brand: true,
            mainCategory: true,
            subcategory: true,
            sizes: true
        }
    });

    if (!product) {
       return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify sizes exist on product
    const sizes = product.sizes as { name: string }[] | undefined;
    if (!sizes || sizes.length === 0) {
         return NextResponse.json({
            recommendedSize: "One Size",
            confidence: 90,
            reasoning: "This product only comes in one standard size."
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Falling back to heuristic matching.");
      return fallbackMatching(userProfile, product);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI Fashion Stylist and Sizing Consultant for an app called "Priisme".
      Your goal is to recommend the best clothing size for a user based on their measurements and the product details.

      User Profile:
      - Height: ${userProfile.height || 'Unknown'}
      - Weight: ${userProfile.weight || 'Unknown'}
      - Body Type: ${userProfile.bodyType || 'Unknown'}
      - Gender: ${userProfile.gender || 'Unknown'}

      Product Details:
      - Name: ${product.name}
      - Brand: ${product.brand}
      - Category: ${product.mainCategory} > ${product.subcategory}
      - Available Sizes: ${sizes.map((s: any) => s.name).join(', ')}

      Analyze these details. Consider typical brand sizing variations (e.g., some brands run small).
      Recommend the single best size from the 'Available Sizes' list.
      Provide a confidence score from 0 to 100.
      Provide a 1-2 sentence explanation of your reasoning addressed to the user.

      Return ONLY a JSON object with this structure (no markdown code blocks):
      {
        "recommendedSize": "String (exact match from Available Sizes)",
        "confidence": Number (0-100),
        "reasoning": "String"
      }
    `;

    let result;
    try {
        result = await model.generateContent(prompt);
    } catch (geminiError) {
        console.error("Gemini API Error:", geminiError);
        return fallbackMatching(userProfile, product);
    }

    const response = result.response;
    const text = response.text();
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedResponse;
    try {
        parsedResponse = JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse Gemini response:", text);
        return fallbackMatching(userProfile, product);
    }

    // Ensure recommended size is actually available
    const availableSizeNames = sizes.map((s: any) => s.name);
    if (!availableSizeNames.includes(parsedResponse.recommendedSize)) {
         // Fallback to first size if AI hallucinated a size
         parsedResponse.recommendedSize = availableSizeNames[0];
         parsedResponse.confidence = 40;
         parsedResponse.reasoning = "We couldn't get a perfect read on your sizing for this specific item, so we defaulted to standard fitting.";
    }

    return NextResponse.json({
        recommendedSize: parsedResponse.recommendedSize,
        confidence: parsedResponse.confidence,
        reasoning: parsedResponse.reasoning
    });

  } catch (error) {
    console.error("AI Fit Check Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
