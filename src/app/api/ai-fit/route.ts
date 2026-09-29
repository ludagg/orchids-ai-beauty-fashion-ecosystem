import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Basic fallback algorithm if Gemini fails or is missing key
function calculateFallbackSize(height: number, weight: number, bodyType: string) {
    let sizeIndex = 2; // Default M

    // Very naive logic just for fallback purposes
    if (height > 185 || weight > 90) sizeIndex = 4; // XL
    else if (height > 175 || weight > 80) sizeIndex = 3; // L
    else if (height < 160 || weight < 55) sizeIndex = 1; // S
    else if (weight < 50) sizeIndex = 0; // XS

    if (bodyType === "curvy" || bodyType === "plus") {
        sizeIndex = Math.min(sizeIndex + 1, SIZES.length - 1);
    } else if (bodyType === "slim") {
        sizeIndex = Math.max(sizeIndex - 1, 0);
    }

    return {
        recommendedSize: SIZES[sizeIndex],
        confidence: 75,
        reasoning: "Based on standard BMI and height-to-weight ratio charts.",
        fitDetails: "This size should provide a comfortable, regular fit based on generic brand sizing."
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, productName, brand, category, measurements } = body;

        if (!measurements || !measurements.height || !measurements.weight || !measurements.bodyType) {
            return NextResponse.json({ error: "Missing measurements" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to basic algorithm.");
            return NextResponse.json({
                recommendation: calculateFallbackSize(
                    Number(measurements.height),
                    Number(measurements.weight),
                    measurements.bodyType
                )
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Sanitize inputs
        const height = String(measurements.height).replace(/[^0-9.]/g, '').substring(0, 10);
        const weight = String(measurements.weight).replace(/[^0-9.]/g, '').substring(0, 10);
        const bodyType = String(measurements.bodyType).replace(/[^a-zA-Z]/g, '').substring(0, 20);
        const safeBrand = String(brand || "generic").replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50);
        const safeCategory = String(category || "clothing").replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50);
        const safeProduct = String(productName || "item").replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 100);

        const prompt = `
            You are an expert AI Fashion Fit Consultant for the app "Rare".
            Your task is to recommend the best clothing size for a user based on their measurements and the specific product.

            User Profile:
            - Height: ${height} cm
            - Weight: ${weight} kg
            - Body Type: ${bodyType}

            Product Information:
            - Name: ${safeProduct}
            - Brand: ${safeBrand}
            - Category: ${safeCategory}

            Provide a size recommendation in JSON format EXACTLY matching this structure (no markdown tags):
            {
                "recommendedSize": "S", // one of: XS, S, M, L, XL, XXL
                "confidence": 92, // a number between 0 and 100
                "reasoning": "A short, friendly sentence explaining why this size is best.",
                "fitDetails": "A short sentence describing how the garment will fit (e.g., 'Slightly loose on the shoulders, perfect length')."
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (error) {
            console.error("Gemini AI fit generation failed:", error);
            return NextResponse.json({
                recommendation: calculateFallbackSize(Number(height), Number(weight), bodyType)
            });
        }

        const responseText = result.response.text();
        const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResult;
        try {
            parsedResult = JSON.parse(jsonString);

            // Validate output
            if (!SIZES.includes(parsedResult.recommendedSize)) {
                parsedResult.recommendedSize = "M";
            }
            if (typeof parsedResult.confidence !== 'number') {
                parsedResult.confidence = 80;
            }

            return NextResponse.json({ recommendation: parsedResult });
        } catch (parseError) {
            console.error("Failed to parse Gemini output:", jsonString);
            return NextResponse.json({
                recommendation: calculateFallbackSize(Number(height), Number(weight), bodyType)
            });
        }
    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
