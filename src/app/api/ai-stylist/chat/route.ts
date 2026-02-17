import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { ilike, or, and, desc, eq, SQL } from "drizzle-orm";

const KEYWORDS = {
    colors: ["red", "blue", "green", "yellow", "black", "white", "pink", "purple", "orange", "grey", "silver", "gold", "beige", "navy", "maroon"],
    categories: ["shirt", "t-shirt", "dress", "jeans", "pants", "skirt", "shoe", "sneaker", "boot", "sandal", "jacket", "coat", "hoodie", "sweater", "accessory", "bag", "watch", "jewelry", "top", "blouse", "trouser", "gown"],
    occasions: ["party", "wedding", "casual", "formal", "office", "summer", "winter", "beach", "gym", "sport", "date", "night"]
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const normalizedMessage = message.toLowerCase();

        // Extract intents
        const foundColors = KEYWORDS.colors.filter(c => normalizedMessage.includes(c));
        const foundCategories = KEYWORDS.categories.filter(c => normalizedMessage.includes(c));
        const foundOccasions = KEYWORDS.occasions.filter(o => normalizedMessage.includes(o));

        const conditions: SQL[] = [
             eq(products.isActive, true)
        ];

        // Build query
        const searchTerms = [...foundColors, ...foundCategories, ...foundOccasions];

        if (searchTerms.length > 0) {
            // Search for EACH term (AND logic) to be precise
            // e.g. "red dress" -> must match red AND dress
            for (const term of searchTerms) {
                 const condition = or(
                     ilike(products.name, `%${term}%`),
                     ilike(products.description, `%${term}%`),
                     ilike(products.category, `%${term}%`)
                 );
                 if (condition) conditions.push(condition);
            }
        }

        let resultProducts: any[] = [];
        let replyMessage = "";

        // If we have specific search terms
        if (searchTerms.length > 0) {
            resultProducts = await db.query.products.findMany({
                where: and(...conditions),
                limit: 4,
                orderBy: [desc(products.rating)]
            });

            if (resultProducts.length > 0) {
                const terms = searchTerms.join(" ");
                replyMessage = `I found some lovely ${terms} options for you! Have a look:`;
            } else {
                // Fallback: If "Red Dress" returns nothing, try searching for just "Dress" or just "Red"
                // For now, just fallback to popular
                replyMessage = `I couldn't find exactly "${searchTerms.join(" ")}" in our collection right now. However, you might like these top-rated items:`;
                resultProducts = await db.query.products.findMany({
                    where: eq(products.isActive, true),
                    limit: 4,
                    orderBy: [desc(products.rating)]
                });
            }
        } else {
             // No product keywords found. Is it a greeting?
             const greetings = ["hi", "hello", "hey", "help", "start"];
             if (greetings.some(g => normalizedMessage.includes(g)) && normalizedMessage.length < 20) {
                 replyMessage = "Hello! I'm your AI Stylist. Tell me what you're looking for! For example: 'I need a red dress for a party' or 'Show me summer sneakers'.";
                 // Don't return products for simple greetings unless we want to show "Featured"
             } else {
                 replyMessage = "I'm not sure I understood the style you're looking for. Could you mention a color, category (like 'dress' or 'shoes'), or occasion? Here are some of our trending pieces:";
                 resultProducts = await db.query.products.findMany({
                    where: eq(products.isActive, true),
                    limit: 4,
                    orderBy: [desc(products.rating)]
                });
             }
        }

        return NextResponse.json({
            message: replyMessage,
            products: resultProducts
        });

    } catch (error) {
        console.error("AI Stylist Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
