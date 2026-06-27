import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

function generateFallbackRecommendation(userProfile: any, product: any) {
    // Simple fallback logic mapping based on weight/height
    const heightStr = userProfile.height || "";
    const weightStr = userProfile.weight || "";
    const bodyTypeStr = userProfile.bodyType || "";

    // Parse some basic numbers if they exist
    const heightMatch = heightStr.match(/\d+/);
    const weightMatch = weightStr.match(/\d+/);

    let heightCm = 170; // default average
    let weightKg = 70; // default average

    if (heightMatch) heightCm = parseInt(heightMatch[0], 10);
    if (weightMatch) weightKg = parseInt(weightMatch[0], 10);

    let recommendedSize = "M";
    let explanation = "Based on average standard sizing conventions.";
    let confidence = 0.6;

    // Very naive mapping just as a fallback
    if (weightKg < 60) {
        recommendedSize = "S";
        explanation = "Based on typical sizing for lighter weight profiles, a small usually fits best.";
        confidence = 0.7;
    } else if (weightKg > 85) {
        recommendedSize = "L";
        if (weightKg > 100) recommendedSize = "XL";
        explanation = "We recommend sizing up based on standard weight profiles for a more comfortable fit.";
        confidence = 0.7;
    } else {
        recommendedSize = "M";
        explanation = "A medium is generally a safe choice based on your measurements.";
        confidence = 0.65;
    }

    if (bodyTypeStr.toLowerCase().includes("athletic") && recommendedSize !== "XL") {
         explanation += " We noted your athletic build, so it should be comfortably snug.";
    }

    // Check if product has this size
    const availableSizes = Array.isArray(product.sizes) ? product.sizes.map((s: any) => s.name?.toUpperCase()) : [];
    if (availableSizes.length > 0 && !availableSizes.includes(recommendedSize)) {
         // recommend closest available? For simplicity, just pick the first available
         recommendedSize = availableSizes[0] || "Unknown";
         explanation = "Your exact recommended size was not found, suggesting closest available.";
         confidence = 0.4;
    }

    return {
        recommendedSize,
        explanation,
        confidence,
        fitType: "regular"
    };
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        // We can allow non-logged-in users if they provide measurements in the body,
        // but for now let's prioritize the logged-in user profile or body overrides.

        const body = await req.json();
        const { productId, height, weight, bodyType } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Determine user profile
        let userProfile = { height: "", weight: "", bodyType: "" };

        if (session?.user) {
            // Fetch from DB if user is logged in
            const dbUser = await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.id, session.user.id),
                columns: { height: true, weight: true, bodyType: true }
            });
            if (dbUser) {
                userProfile.height = dbUser.height || "";
                userProfile.weight = dbUser.weight || "";
                userProfile.bodyType = dbUser.bodyType || "";
            }
        }

        // Overrides from request body (e.g. guest user or logged in user trying new values)
        if (height) userProfile.height = height;
        if (weight) userProfile.weight = weight;
        if (bodyType) userProfile.bodyType = bodyType;

        if (!userProfile.height && !userProfile.weight) {
             return NextResponse.json({ error: "Height or weight is required for AI Fit Check" }, { status: 400 });
        }

        // Fetch Product Data
        const productData = await db.query.products.findFirst({
             where: eq(products.id, productId),
             columns: { id: true, name: true, brand: true, mainCategory: true, sizes: true, material: true, description: true }
        });

        if (!productData) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Using fallback algorithm for AI Fit Check.");
            const fallbackResult = generateFallbackRecommendation(userProfile, productData);
            return NextResponse.json(fallbackResult);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const availableSizes = Array.isArray(productData.sizes)
            ? productData.sizes.map((s: any) => s.name).join(", ")
            : "Unknown";

        const prompt = `
            You are an AI Fit Check assistant for a fashion marketplace.
            Your task is to recommend the best size for a user based on their measurements and the product details.

            User Profile:
            - Height: ${userProfile.height}
            - Weight: ${userProfile.weight}
            - Body Type: ${userProfile.bodyType || 'Not specified'}

            Product Details:
            - Brand: ${productData.brand}
            - Name: ${productData.name}
            - Category: ${productData.mainCategory}
            - Material: ${productData.material || 'Unknown'}
            - Description: ${productData.description}
            - Available Sizes: ${availableSizes}

            Analyze this data and return ONLY a JSON object with this exact structure (no markdown):
            {
                "recommendedSize": "The recommended size string (e.g., 'M', 'L', '32')",
                "explanation": "A short, friendly sentence explaining why this size is recommended based on the user's profile and product fit.",
                "confidence": 0.85,
                "fitType": "regular" // can be "tight", "regular", or "loose"
            }
            Ensure the confidence is a number between 0 and 1.
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

            const parsedResponse = JSON.parse(jsonString);

            return NextResponse.json({
                recommendedSize: parsedResponse.recommendedSize || "Unknown",
                explanation: parsedResponse.explanation || "Based on your profile.",
                confidence: parsedResponse.confidence || 0.5,
                fitType: parsedResponse.fitType || "regular"
            });

        } catch (geminiError) {
             console.error("Gemini API Error in AI Fit Check:", geminiError);
             const fallbackResult = generateFallbackRecommendation(userProfile, productData);
             return NextResponse.json(fallbackResult);
        }

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
