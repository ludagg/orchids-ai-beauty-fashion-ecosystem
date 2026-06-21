import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { product } = body;

        if (!product || !product.sizes || product.sizes.length === 0) {
             return NextResponse.json({ error: "Product or sizes missing" }, { status: 400 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        });

        if (!user) {
             return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userMeasurements = {
             height: user.height || "average",
             weight: user.weight || "average",
             bodyType: user.bodyType || "average"
        };

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
             // Fallback Logic
             let recommendedSize = product.sizes[Math.floor(product.sizes.length / 2)]?.name || "M";

             if (userMeasurements.weight && typeof userMeasurements.weight === 'string') {
                  const w = userMeasurements.weight.toLowerCase();
                  if (w.includes("light") || w.includes("slim") || parseInt(w) < 60) {
                      recommendedSize = product.sizes[0]?.name || "S";
                  } else if (w.includes("heavy") || parseInt(w) > 90) {
                      recommendedSize = product.sizes[product.sizes.length - 1]?.name || "XL";
                  }
             }

             return NextResponse.json({
                 recommendedSize,
                 confidence: 60,
                 analysis: `Based on a basic analysis of your profile, we recommend size ${recommendedSize}. For more accurate results, add more details to your profile.`
             });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const availableSizes = product.sizes.map((s: any) => s.name).join(", ");

        const prompt = `
            You are an expert fashion stylist and tailor AI for the app "Rare".
            Your task is to recommend the best clothing size for a user based on their measurements and the product details.

            User Profile:
            - Height: ${userMeasurements.height}
            - Weight: ${userMeasurements.weight}
            - Body Type: ${userMeasurements.bodyType}

            Product Details:
            - Name: ${product.name}
            - Brand: ${product.brand || 'Unknown'}
            - Available Sizes: ${availableSizes}
            - Description: ${product.description || 'N/A'}

            Provide:
            1. The single best recommended size from the available sizes.
            2. A confidence score between 0 and 100.
            3. A short, friendly explanation (max 2 sentences) of why this size is recommended based on their body type and the product style.

            Respond strictly in JSON format (no markdown):
            {
                "recommendedSize": "M",
                "confidence": 85,
                "analysis": "Based on your height and athletic body type, size M should offer a comfortable fit for this brand while accommodating your shoulders."
            }
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response in AI Fit Check:", text);
            return NextResponse.json({
                recommendedSize: product.sizes[Math.floor(product.sizes.length / 2)]?.name || "M",
                confidence: 50,
                analysis: "We had trouble analyzing your perfect fit, but this is a popular size."
            });
        }

        // Validate recommended size is in available sizes
        let finalSize = parsedResponse.recommendedSize;
        if (!product.sizes.some((s: any) => s.name === finalSize)) {
             finalSize = product.sizes[Math.floor(product.sizes.length / 2)]?.name || "M";
        }

        return NextResponse.json({
             recommendedSize: finalSize,
             confidence: parsedResponse.confidence || 70,
             analysis: parsedResponse.analysis || "Based on your profile, we think this size is a great match."
        });

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
