import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { inArray } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productIds } = body;

        if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
            return NextResponse.json({ error: "At least 2 product IDs are required for comparison" }, { status: 400 });
        }

        if (productIds.length > 4) {
            return NextResponse.json({ error: "Cannot compare more than 4 products at once" }, { status: 400 });
        }

        const items = await db.query.products.findMany({
            where: inArray(products.id, productIds)
        });

        if (items.length < 2) {
            return NextResponse.json({ error: "Could not find enough products to compare" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        let comparisonResult = {
             winnerId: items[0].id,
             summary: "Based on basic metrics, this item offers a good balance.",
             features: items.map(item => ({
                 id: item.id,
                 pros: ["Good price", "Standard features"],
                 cons: ["Limited details available"]
             }))
        };

        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const productDescriptions = items.map(p => `
                    ID: ${p.id}
                    Name: ${p.name}
                    Brand: ${p.brand || "Generic"}
                    Category: ${p.category || "Uncategorized"}
                    Price: ${p.salePrice || p.originalPrice || 0} cents
                    Rating: ${p.rating || 0} (${p.reviewCount || 0} reviews)
                    Description: ${p.description || "N/A"}
                `).join("\n\n");

                const prompt = `
                    You are an expert AI shopping assistant. Compare the following products and provide a concise analysis.

                    Products:
                    ${productDescriptions}

                    Return ONLY a JSON object (no markdown) with:
                    {
                        "winnerId": "The ID of the best overall product",
                        "summary": "A 2-3 sentence summary of the comparison.",
                        "features": [
                            {
                                "id": "Product ID",
                                "pros": ["Pro 1", "Pro 2"],
                                "cons": ["Con 1", "Con 2"]
                            }
                        ]
                    }
                `;

                const result = await model.generateContent(prompt);
                const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
                const parsed = JSON.parse(text);

                comparisonResult = parsed;
            } catch (aiError) {
                console.error("AI Compare generation error:", aiError);
            }
        }

        return NextResponse.json({
            products: items,
            comparison: comparisonResult
        });

    } catch (error) {
        console.error("AI Compare Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
