import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Ensure this doesn't crash during build/test if API key is missing
const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productId, height, weight, bodyType } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Fetch product info to get sizing context
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
            columns: {
                id: true,
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

        // Validate basic measurements
        if (!height && !weight && !bodyType) {
            return NextResponse.json({ error: "No measurements provided" }, { status: 400 });
        }

        const genAI = getGenAI();

        // 1. Try Google Generative AI
        if (genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const prompt = `
You are an expert AI fashion stylist and tailor (AI Fit Check).
Analyze the following user measurements and product details to recommend the best size.

Product:
- Name: ${product.name}
- Brand: ${product.brand}
- Category: ${product.mainCategory} > ${product.subcategory}
- Description: ${product.description || "N/A"}

User Profile:
- Height: ${height || "Unknown"}
- Weight: ${weight || "Unknown"}
- Body Type: ${bodyType || "Unknown"}

Output JSON only with the following keys:
- "recommendedSize": a short string (e.g., "S", "M", "L", "XL", "32", "One Size")
- "explanation": a concise 1-2 sentence explanation of why this size is recommended based on the user's profile and brand sizing tendencies.
- "confidenceScore": a number from 1 to 100 representing how confident you are in this recommendation.
`;
                const result = await model.generateContent(prompt);
                const response = result.response;
                let text = response.text();

                // Clean up markdown formatting if present
                if (text.includes("```json")) {
                     text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                } else if (text.includes("```")) {
                     text = text.replace(/```/g, '').trim();
                }

                const parsed = JSON.parse(text);
                if (parsed.recommendedSize && parsed.explanation) {
                    return NextResponse.json(parsed);
                }
            } catch (aiError) {
                console.error("AI Error:", aiError);
                // Fallback to local heuristic
            }
        }

        // 2. Local Heuristic Fallback
        return NextResponse.json(calculateHeuristicFit(product, height, weight, bodyType));

    } catch (error) {
        console.error("Error in AI Fit Check:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

function calculateHeuristicFit(product: any, height?: string, weight?: string, bodyType?: string) {
    let size = "M";
    let score = 70;

    const hNum = height ? parseInt(height.replace(/[^0-9]/g, '')) : null;
    const wNum = weight ? parseInt(weight.replace(/[^0-9]/g, '')) : null;

    if (wNum && hNum) {
        // Very basic BMI-ish logic for demo purposes
        const ratio = wNum / (hNum * hNum / 10000);

        if (ratio < 20) {
            size = "S";
        } else if (ratio >= 20 && ratio < 25) {
            size = "M";
        } else if (ratio >= 25 && ratio < 30) {
            size = "L";
        } else {
            size = "XL";
        }
    }

    if (bodyType) {
        const bt = bodyType.toLowerCase();
        if (bt.includes("athletic") || bt.includes("muscular")) {
            if (size === "S") size = "M";
            if (size === "M") size = "L";
        } else if (bt.includes("slim") || bt.includes("skinny")) {
             // Keep or go down
        }
    }

    return {
        recommendedSize: size,
        explanation: `Based on your profile, we recommend size ${size} for standard comfort. This is a heuristic estimation.`,
        confidenceScore: score
    };
}
