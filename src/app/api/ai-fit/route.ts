import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function heuristicFallback(height: string, weight: string, bodyType: string, sizes: any[]) {
    // A very simple heuristic to recommend a size based on height, weight, and body type
    // This is just a fallback in case the AI is not available
    const heightCm = parseInt(height);
    const weightKg = parseInt(weight);

    if (isNaN(heightCm) || isNaN(weightKg) || !sizes || sizes.length === 0) {
        return {
            size: sizes[0]?.name || "M",
            fit: "regular",
            confidence: 50,
            explanation: "Based on standard sizing, we recommend this size for you."
        };
    }

    let bmi = weightKg / ((heightCm / 100) * (heightCm / 100));

    let recommendedSize = "M";
    let fit = "regular";

    if (bmi < 18.5) {
        recommendedSize = "S";
        if (bodyType === "slim") fit = "regular";
        else fit = "loose";
    } else if (bmi >= 18.5 && bmi < 25) {
        recommendedSize = "M";
        fit = "regular";
    } else if (bmi >= 25 && bmi < 30) {
        recommendedSize = "L";
        if (bodyType === "athletic") fit = "tight";
        else fit = "regular";
    } else {
        recommendedSize = "XL";
        fit = "tight";
    }

    // Adjust based on body type
    if (bodyType === "broad_shoulders" && recommendedSize === "M") {
        recommendedSize = "L";
    } else if (bodyType === "curvy" && recommendedSize === "M") {
        recommendedSize = "L";
    }

    // Try to find the closest match in the available sizes
    const availableSizeNames = sizes.map(s => s.name.toUpperCase());
    if (!availableSizeNames.includes(recommendedSize)) {
        if (recommendedSize === "M" && availableSizeNames.includes("L")) recommendedSize = "L";
        else if (recommendedSize === "M" && availableSizeNames.includes("S")) recommendedSize = "S";
        else recommendedSize = availableSizeNames[0] || "M";
    }

    return {
        size: recommendedSize,
        fit: fit,
        confidence: 70,
        explanation: "Based on your measurements and typical brand sizing, we think this will fit you well."
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { height, weight, bodyType, product, sizes } = body;

        if (!height || !weight || !bodyType || !product || !sizes) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === "dummy-gemini-key") {
            const fallbackResult = heuristicFallback(height, weight, bodyType, sizes);
            return NextResponse.json(fallbackResult);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI Fit Check assistant for a fashion app. Your goal is to recommend the best clothing size for a user based on their measurements and the product details.

            User Measurements:
            - Height: ${height}
            - Weight: ${weight}
            - Body Type: ${bodyType}

            Product Details:
            - Name: ${product.name}
            - Brand: ${product.brand}
            - Category: ${product.mainCategory} > ${product.subcategory}
            - Description: ${product.description}
            - Material: ${product.material || "Unknown"}
            - Available Sizes: ${JSON.stringify(sizes)}

            Based on this information, please recommend the best size for the user. Also, predict how the item will fit (tight, regular, loose).
            Provide a confidence score between 0 and 100.
            Give a short, friendly explanation for your recommendation.

            Return ONLY a JSON object with this exact structure (no markdown code blocks):
            {
                "size": "The recommended size (e.g., S, M, L)",
                "fit": "tight, regular, or loose",
                "confidence": 85,
                "explanation": "Your explanation here"
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (error) {
            console.error("Gemini API Error:", error);
            const fallbackResult = heuristicFallback(height, weight, bodyType, sizes);
            return NextResponse.json(fallbackResult);
        }

        const text = result.response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            const fallbackResult = heuristicFallback(height, weight, bodyType, sizes);
            return NextResponse.json(fallbackResult);
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
