import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productIds } = body;

        if (!Array.isArray(productIds) || productIds.length < 2) {
            return NextResponse.json({ error: "Need at least 2 product IDs to compare" }, { status: 400 });
        }

        const itemsToCompare = await db.query.products.findMany({
            where: inArray(products.id, productIds.slice(0, 3)), // Max 3 items
            columns: {
                id: true,
                name: true,
                description: true,
                mainCategory: true,
                salePrice: true,
                originalPrice: true,
                material: true,
                rating: true,
                reviewCount: true
            }
        });

        if (itemsToCompare.length < 2) {
             return NextResponse.json({ error: "Could not find enough products to compare" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        const generateFallbackComparison = () => {
             return NextResponse.json({
                 summary: "Comparison based on basic metrics.",
                 recommendation: itemsToCompare[0].id, // Just recommend the first one
                 features: [
                     {
                         name: "Price",
                         values: itemsToCompare.reduce((acc, item) => ({...acc, [item.id]: `${((item.salePrice || item.originalPrice) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR'})}`}), {})
                     },
                     {
                         name: "Rating",
                         values: itemsToCompare.reduce((acc, item) => ({...acc, [item.id]: `${item.rating || 'N/A'} (${item.reviewCount || 0} reviews)`}), {})
                     }
                 ]
             });
        };

        if (!apiKey) {
             console.warn("GEMINI_API_KEY is not set. Falling back to simple comparison.");
             return generateFallbackComparison();
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const productsJson = JSON.stringify(itemsToCompare.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: (p.salePrice || p.originalPrice) / 100,
            material: p.material,
            rating: p.rating
        })));

        const prompt = `
            You are an AI Shopping Assistant for a fashion and beauty app called "Rare".
            The user wants to compare these products:
            ${productsJson}

            Analyze the products and provide a comparison.
            Highlight the best value for money and the premium option if applicable.
            Return ONLY a JSON object with this structure (no markdown code blocks, no other text):
            {
                "summary": "A short 2-sentence summary of the comparison.",
                "recommendation": "The ID of the recommended product",
                "features": [
                    {
                        "name": "Feature name (e.g., 'Material', 'Value', 'Style')",
                        "values": {
                            "product_id_1": "Description for product 1",
                            "product_id_2": "Description for product 2"
                        }
                    }
                ]
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error in AI Compare:", geminiError);
            return generateFallbackComparison();
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response for AI Compare:", text);
            return generateFallbackComparison();
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Compare API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
