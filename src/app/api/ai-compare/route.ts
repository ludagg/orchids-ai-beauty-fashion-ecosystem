import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq, ilike, or } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

function fallbackCompareLogic(baseProduct: any, targetProduct: any) {
    const isCheaper = (targetProduct?.salePrice || targetProduct?.originalPrice) < (baseProduct.salePrice || baseProduct.originalPrice);

    return {
        baseProduct,
        targetProduct,
        comparison: {
            summary: targetProduct
                ? `Comparing ${baseProduct.name} to ${targetProduct.name}. ${isCheaper ? 'The alternative is more budget-friendly.' : 'Both are premium options.'} (Basic Fallback Analysis)`
                : `Could not find a specific product matching your query to compare against ${baseProduct.name}.`,
            basePros: [
                "Original selection",
                "High quality materials based on brand",
                baseProduct.rating > 4 ? "Highly rated by users" : "Good value"
            ],
            targetPros: targetProduct ? [
                isCheaper ? "More affordable option" : "Premium alternative",
                targetProduct.rating > baseProduct.rating ? "Higher user rating" : "Similar feature set",
                "Great alternative for this style"
            ] : []
        }
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { baseProductId, targetQuery } = body;

        if (!baseProductId || !targetQuery) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // Fetch base product
        const baseProduct = await db.query.products.findFirst({
            where: eq(products.id, baseProductId)
        });

        if (!baseProduct) {
            return NextResponse.json({ error: "Base product not found" }, { status: 404 });
        }

        // Attempt to find a target product based on the query
        // This is a naive search. In a real app, this might use pg_vector or a dedicated search engine.
        const searchTerms = targetQuery.split(" ").filter((t: string) => t.length > 3);

        let targetProduct = null;
        if (searchTerms.length > 0) {
            const conditions = searchTerms.map((t: string) => or(
                ilike(products.name, `%${t}%`),
                ilike(products.brand, `%${t}%`),
                ilike(products.description, `%${t}%`)
            ));

            targetProduct = await db.query.products.findFirst({
                where: or(...conditions)
            });
        }

        // Avoid comparing with itself
        if (targetProduct && targetProduct.id === baseProduct.id) {
             targetProduct = null;
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || !targetProduct) {
             console.warn("GEMINI_API_KEY missing or no target product found. Using fallback.");
             return NextResponse.json(fallbackCompareLogic(baseProduct, targetProduct));
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const formatPrice = (p: number) => `₹${(p / 100).toFixed(0)}`;

        const prompt = `
            You are an expert AI Shopping Assistant.
            Compare these two products objectively to help a customer decide.

            Product A (Base):
            - Name: ${baseProduct.name}
            - Brand: ${baseProduct.brand}
            - Price: ${formatPrice(baseProduct.salePrice || baseProduct.originalPrice)}
            - Description: ${baseProduct.description}
            - Rating: ${baseProduct.rating}

            Product B (Alternative):
            - Name: ${targetProduct.name}
            - Brand: ${targetProduct.brand}
            - Price: ${formatPrice(targetProduct.salePrice || targetProduct.originalPrice)}
            - Description: ${targetProduct.description}
            - Rating: ${targetProduct.rating}

            Provide a concise, helpful comparison.
            Return ONLY a JSON object with this exact structure (no markdown tags):
            {
                "summary": "A 2-3 sentence overall verdict comparing value, style, and quality.",
                "basePros": ["pro 1", "pro 2", "pro 3"],
                "targetPros": ["pro 1", "pro 2", "pro 3"]
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error:", geminiError);
            return NextResponse.json(fallbackCompareLogic(baseProduct, targetProduct));
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let comparisonData;
        try {
            comparisonData = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json(fallbackCompareLogic(baseProduct, targetProduct));
        }

        return NextResponse.json({
            baseProduct,
            targetProduct,
            comparison: comparisonData
        });

    } catch (error) {
        console.error("AI Compare Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
