import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { products, salons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini if key is available
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId, height, weight, bodyType } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        if (!height || !weight || !bodyType) {
            return NextResponse.json({ error: "Measurements are incomplete" }, { status: 400 });
        }

        // Fetch product info to provide context
        const productInfo = await db.query.products.findFirst({
            where: eq(products.id, productId),
            with: {
                salon: true,
            }
        });

        if (!productInfo) {
             return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        let recommendation = "";
        let recommendedSize = "M"; // Default

        // Use Gemini if available
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `
                You are an AI Fit Expert. Analyze the following user and product to recommend the best size.

                User Profile:
                - Height: ${height}
                - Weight: ${weight}
                - Body Type: ${bodyType}

                Product Details:
                - Name: ${productInfo.name}
                - Brand: ${productInfo.brand}
                - Category: ${productInfo.mainCategory} > ${productInfo.subcategory}
                - Material: ${productInfo.material || 'Unknown'}
                - Available Sizes (if any context): XS, S, M, L, XL, XXL

                Based on this information, recommend a size. Keep it brief.
                Format your response EXACTLY like this:
                SIZE: [The recommended size, e.g., M]
                REASON: [1-2 sentences explaining why, e.g., Based on your height and weight, this brand's M will fit you perfectly while allowing movement.]
            `;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // Basic parsing
            const sizeMatch = text.match(/SIZE:\s*(.+)/i);
            const reasonMatch = text.match(/REASON:\s*(.+)/i);

            if (sizeMatch && reasonMatch) {
                recommendedSize = sizeMatch[1].trim();
                recommendation = reasonMatch[1].trim();
            } else {
                 // Fallback if parsing fails
                 recommendation = text;
            }
        } else {
             // Fallback logic when no API key
             const h = parseFloat(height);
             const w = parseFloat(weight);

             if (h > 185 || w > 90) {
                 recommendedSize = "XL";
                 recommendation = "Based on your profile measurements, XL should provide a comfortable fit.";
             } else if (h > 175 || w > 75) {
                 recommendedSize = "L";
                 recommendation = "L is the ideal size for your body type with this brand.";
             } else if (h > 165 || w > 60) {
                 recommendedSize = "M";
                 recommendation = "We recommend size M based on your height and weight for a perfect true-to-size fit.";
             } else {
                 recommendedSize = "S";
                 recommendation = "S is recommended for your measurements to ensure a snug fit.";
             }
        }

        return NextResponse.json({
             recommendedSize,
             recommendation
        });

    } catch (error) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
