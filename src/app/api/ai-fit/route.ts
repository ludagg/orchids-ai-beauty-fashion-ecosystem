import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, measurements } = body;

    if (!productId || !measurements) {
      return NextResponse.json(
        { error: "Product ID and measurements are required" },
        { status: 400 }
      );
    }

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if no API key is provided
    if (!apiKey || apiKey === "dummy-gemini-key") {
      const sizes = product.sizes || [{ name: "S" }, { name: "M" }, { name: "L" }];
      // Provide a simplistic fallback logic
      let recommendedSize = sizes[1]?.name || sizes[0]?.name || "M";

      if (measurements.weight && parseInt(measurements.weight) > 85) {
        recommendedSize = sizes[sizes.length - 1]?.name || "L";
      } else if (measurements.weight && parseInt(measurements.weight) < 60) {
        recommendedSize = sizes[0]?.name || "S";
      }

      return NextResponse.json({
        size: recommendedSize,
        explanation: `Based on a basic calculation (fallback mode), we recommend size ${recommendedSize}. For more accurate recommendations, please provide an AI API key.`,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI fashion stylist and tailor.
      Recommend the best size for a customer based on the following details:

      User Measurements:
      - Height: ${measurements.height} cm
      - Weight: ${measurements.weight} kg
      - Body Type: ${measurements.bodyType || "Not specified"}

      Product Details:
      - Name: ${product.name}
      - Brand: ${product.brand}
      - Available Sizes: ${JSON.stringify(product.sizes)}
      - Description: ${product.description}

      Return your answer strictly in JSON format matching this structure:
      {
        "size": "The recommended size from the available sizes",
        "explanation": "A friendly, short paragraph explaining why this size is recommended based on their measurements and the product characteristics."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to extract JSON from markdown if needed
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
       throw new Error("Invalid response format from AI");
    }

    const recommendation = JSON.parse(jsonMatch[0]);

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error("AI Fit Error:", error);
    return NextResponse.json(
      { error: "Failed to generate fit recommendation" },
      { status: 500 }
    );
  }
}
