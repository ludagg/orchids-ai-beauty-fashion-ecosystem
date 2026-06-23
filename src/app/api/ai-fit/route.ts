import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function fallbackFitLogic(user: any, product: any) {
  // A simple heuristic based algorithm if AI is unavailable
  let recommendedSize = "M"; // Default
  let explanation = "Based on general brand sizing, we suggest this size for you.";

  if (!user.height && !user.weight && !user.bodyType) {
    return {
      size: recommendedSize,
      explanation: "Please add your measurements to your profile for personalized fit recommendations."
    };
  }

  const w = parseInt(user.weight || "70", 10);
  const h = parseInt(user.height || "170", 10);

  if (w < 60 || h < 165) recommendedSize = "S";
  else if (w > 85 || h > 185) recommendedSize = "L";
  else recommendedSize = "M";

  if (user.bodyType === "athletic" && recommendedSize === "M") {
     recommendedSize = "L"; // might want a looser fit
  }

  explanation = `Based on your profile (${user.weight || '?'}kg, ${user.height || '?'}cm) and this product's typical fit, ${recommendedSize} should be comfortable for you.`;

  return {
    size: recommendedSize,
    explanation
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Fetch user profile
    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        height: true,
        weight: true,
        bodyType: true,
      }
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Fetch product details
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      columns: {
        name: true,
        brand: true,
        description: true,
        mainCategory: true,
        subcategory: true,
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Falling back to heuristic fit algorithm.");
      const fallbackResult = await fallbackFitLogic(userProfile, product);
      return NextResponse.json(fallbackResult);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI Fit Assistant for a clothing app.

      User Profile:
      - Height: ${userProfile.height || "Not provided"} cm
      - Weight: ${userProfile.weight || "Not provided"} kg
      - Body Type: ${userProfile.bodyType || "Not provided"}

      Product Details:
      - Name: ${product.name}
      - Brand: ${product.brand}
      - Category: ${product.mainCategory} > ${product.subcategory}
      - Description: ${product.description}

      Task: Analyze the user's body metrics and the product details. Determine the best size (XS, S, M, L, XL, XXL) for this user.
      Also provide a short, friendly explanation (1-2 sentences) of why this size is recommended.
      If the user lacks measurements, suggest a default size and tell them to update their profile.

      Return ONLY a JSON object with this exact structure (no markdown code blocks, no extra text):
      {
        "size": "M",
        "explanation": "Based on your height and athletic build, size M will provide the best balance of comfort and style for this brand."
      }
    `;

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (geminiError) {
      console.error("Gemini API Error for Fit Check:", geminiError);
      const fallbackResult = await fallbackFitLogic(userProfile, product);
      return NextResponse.json(fallbackResult);
    }

    const response = result.response;
    const text = response.text();
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(jsonString);
      // Validate schema
      if (!parsedResponse.size || !parsedResponse.explanation) {
          throw new Error("Invalid schema returned by AI");
      }
    } catch (e) {
      console.error("Failed to parse Gemini fit response:", text);
      const fallbackResult = await fallbackFitLogic(userProfile, product);
      return NextResponse.json(fallbackResult);
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("AI Fit API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
