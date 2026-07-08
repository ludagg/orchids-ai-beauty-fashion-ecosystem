import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { inArray } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function generateFallbackComparison(items: any[]) {
    if (items.length < 2) {
        return {
            summary: "Please select at least two items to compare.",
            points: []
        };
    }

    const item1Price = items[0].salePrice ?? items[0].originalPrice;
    const item2Price = items[1].salePrice ?? items[1].originalPrice;
    const priceDiff = Math.abs(item1Price - item2Price);
    const isPriceDifferent = priceDiff > 0;
    const cheaperItem = item1Price < item2Price ? items[0] : items[1];

    const points = [];
    if (isPriceDifferent) {
        points.push({
            title: "Price Difference",
            description: `${cheaperItem.name} is more affordable.`
        });
    } else {
        points.push({
            title: "Price",
            description: "Both items are priced similarly."
        });
    }

    if (items[0].rating && items[1].rating) {
        if (items[0].rating > items[1].rating) {
            points.push({ title: "Rating", description: `${items[0].name} has a higher rating (${items[0].rating.toFixed(1)} vs ${items[1].rating.toFixed(1)}).` });
        } else if (items[1].rating > items[0].rating) {
            points.push({ title: "Rating", description: `${items[1].name} has a higher rating (${items[1].rating.toFixed(1)} vs ${items[0].rating.toFixed(1)}).` });
        } else {
             points.push({ title: "Rating", description: `Both items have equal ratings (${items[0].rating.toFixed(1)}).` });
        }
    }

    if (items[0].material || items[1].material) {
        points.push({
             title: "Material",
             description: `${items[0].name} uses ${items[0].material || 'standard materials'} while ${items[1].name} uses ${items[1].material || 'standard materials'}.`
        });
    }

    return {
        summary: `Comparing ${items[0].name} and ${items[1].name}.`,
        points
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { itemIds } = body;

        if (!Array.isArray(itemIds) || itemIds.length < 2) {
            return NextResponse.json({ error: "Please provide at least two item IDs to compare" }, { status: 400 });
        }

        const fetchedProducts = await db.query.products.findMany({
            where: inArray(products.id, itemIds),
            limit: 5
        });

        if (fetchedProducts.length < 2) {
            return NextResponse.json({ error: "Could not find enough valid products to compare" }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to local heuristic comparison.");
            const fallbackResult = await generateFallbackComparison(fetchedProducts);
            return NextResponse.json(fallbackResult);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const productsDataString = fetchedProducts.map(p => `
Name: ${p.name}
Brand: ${p.brand}
Price: ${(p.salePrice ?? p.originalPrice) / 100}
Rating: ${p.rating} (${p.reviewCount} reviews)
Material: ${p.material || 'N/A'}
Description: ${p.description}
        `).join('\n\n---\n\n');

        const prompt = `
            You are a helpful AI styling and shopping assistant for the "Rare" app.
            Please compare the following products and provide a brief summary and a few key comparison points (like price, material, ratings, use cases).

            Products:
            ${productsDataString}

            Return ONLY a JSON object with this structure (no markdown code blocks):
            {
                "summary": "A short 1-2 sentence overall summary of the comparison.",
                "points": [
                    { "title": "Price", "description": "Comparison of prices." },
                    { "title": "Material", "description": "Comparison of materials." },
                    { "title": "Best For", "description": "Which one is best for what situation." }
                ]
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (error) {
             console.error("Gemini API Error during comparison:", error);
             const fallbackResult = await generateFallbackComparison(fetchedProducts);
             return NextResponse.json(fallbackResult);
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini comparison response:", text);
            const fallbackResult = await generateFallbackComparison(fetchedProducts);
            return NextResponse.json(fallbackResult);
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("AI Compare Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
