import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function fallbackRecommendation(user: any, product: any) {
  // Simple heuristic based on user profile and product
  let size = "M";
  let explanation = "Based on our general sizing guidelines, this is the most common size.";

  if (user.height && user.weight) {
    // Just a dummy logic for fallback
    const h = parseInt(user.height);
    if (!isNaN(h)) {
      if (h > 180) size = "L";
      else if (h < 160) size = "S";
    }
    explanation = `Based on your height and weight, we recommend size ${size}. This brand typically runs true to size.`;
  }

  return NextResponse.json({
    size,
    explanation,
    confidence: 85
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Fetch user measurements
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { height: true, weight: true, bodyType: true }
    });

    // Fetch product details
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId)
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Falling back to heuristic matching.");
      return fallbackRecommendation(user, product);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI Fit Expert for a fashion app. Your job is to recommend the best clothing size for a user based on their measurements and the product details.

      User Profile:
      - Height: ${user?.height || 'Not provided'}
      - Weight: ${user?.weight || 'Not provided'}
      - Body Type: ${user?.bodyType || 'Not provided'}

      Product Details:
      - Name: ${product.name}
      - Category: ${product.mainCategory} / ${product.subcategory}
      - Description: ${product.description}
      - Brand: ${product.brand}

      Analyze the user profile and product details to determine the optimal size.
      Consider that different brands might have different sizing standards.
      If the user profile is incomplete, provide a best guess based on the product and explain what information is missing.

      Return ONLY a JSON object with this structure (no markdown code blocks):
      {
          "size": "The recommended size (e.g., S, M, L, XL, etc.)",
          "explanation": "A short, friendly explanation of why this size is recommended based on the user's profile and the product's fit.",
          "confidence": 85 // An integer between 0 and 100 indicating how confident you are in this recommendation
      }
    `;

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (geminiError) {
      console.error("Gemini API Error:", geminiError);
      return fallbackRecommendation(user, product);
    }

    const response = result.response;
    const text = response.text();
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini response:", text);
      return fallbackRecommendation(user, product);
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("AI Fit Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
