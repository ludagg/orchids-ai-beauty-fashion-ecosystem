import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { ilike, or, and, desc, eq, SQL } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { log } from "@/lib/logger";

const FALLBACK_KEYWORDS = {
    colors: ["red", "blue", "green", "yellow", "black", "white", "pink", "purple", "orange", "grey", "silver", "gold", "beige", "navy", "maroon"],
    categories: ["shirt", "t-shirt", "dress", "jeans", "pants", "skirt", "shoe", "sneaker", "boot", "sandal", "jacket", "coat", "hoodie", "sweater", "accessory", "bag", "watch", "jewelry", "top", "blouse", "trouser", "gown"],
    occasions: ["party", "wedding", "casual", "formal", "office", "summer", "winter", "beach", "gym", "sport", "date", "night"]
};

interface SearchCriteria {
    category: string[];
    color: string[];
    occasion: string[];
    keywords: string[];
}

interface GeminiResponse {
    reply: string;
    searchCriteria: SearchCriteria;
}

async function fallbackKeywordMatching(message: string) {
    const normalizedMessage = message.toLowerCase();
    const foundColors = FALLBACK_KEYWORDS.colors.filter(c => normalizedMessage.includes(c));
    const foundCategories = FALLBACK_KEYWORDS.categories.filter(c => normalizedMessage.includes(c));
    const foundOccasions = FALLBACK_KEYWORDS.occasions.filter(o => normalizedMessage.includes(o));

    const conditions: SQL[] = [eq(products.isActive, true)];
    const searchTerms = [...foundColors, ...foundCategories, ...foundOccasions];

    if (searchTerms.length > 0) {
        for (const term of searchTerms) {
             conditions.push(or(
                 ilike(products.name, `%${term}%`),
                 ilike(products.description, `%${term}%`),
                 ilike(products.category, `%${term}%`)
             ));
        }
    }

    let resultProducts: unknown[] = [];
    let replyMessage = "";

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
            replyMessage = `I couldn't find exactly "${searchTerms.join(" ")}" in our collection right now. However, you might like these top-rated items:`;
            resultProducts = await db.query.products.findMany({
                where: eq(products.isActive, true),
                limit: 4,
                orderBy: [desc(products.rating)]
            });
        }
    } else {
         const greetings = ["hi", "hello", "hey", "help", "start"];
         if (greetings.some(g => normalizedMessage.includes(g)) && normalizedMessage.length < 20) {
             replyMessage = "Hello! I'm your AI Stylist. Tell me what you're looking for! For example: 'I need a red dress for a party' or 'Show me summer sneakers'.";
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
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
             log.warn("GEMINI_API_KEY is not set. Falling back to keyword matching.");
             return fallbackKeywordMatching(message);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a helpful and chic AI Fashion Stylist for an app called "Rare".
            Your goal is to help users find fashion items from our store.

            User Message: "${message}"

            Please analyze the user's message and extract the following search criteria if present:
            - category: (e.g., dress, shirt, shoes, bag) - singular form preferred
            - color: (e.g., red, blue, black)
            - occasion: (e.g., party, wedding, casual, gym)
            - keywords: (any other specific descriptors like "silk", "long sleeve", "winter")

            Also, formulate a short, friendly, and engaging reply to the user.
            If the user is just saying hello, be welcoming.
            If the user asks for something, say you are looking for it.

            Return ONLY a JSON object with this structure (no markdown code blocks):
            {
                "reply": "Your friendly reply here",
                "searchCriteria": {
                    "category": ["array of strings"],
                    "color": ["array of strings"],
                    "occasion": ["array of strings"],
                    "keywords": ["array of strings"]
                }
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            log.error("Gemini API Error", geminiError);
            return fallbackKeywordMatching(message);
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse: GeminiResponse;
        try {
            parsedResponse = JSON.parse(jsonString) as GeminiResponse;
        } catch (e) {
            log.error("Failed to parse Gemini response", e, { responseText: text.substring(0, 200) });
            return fallbackKeywordMatching(message);
        }

        const { reply, searchCriteria } = parsedResponse;

        // Build Database Query
        const conditions: SQL[] = [eq(products.isActive, true)];

        const categories = searchCriteria?.category || [];
        const colors = searchCriteria?.color || [];
        const occasions = searchCriteria?.occasion || [];
        const keywords = searchCriteria?.keywords || [];

        const allTerms = [...categories, ...colors, ...occasions, ...keywords];

        // If Gemini extracted specific terms, we build a query
        if (allTerms.length > 0) {
            if (categories.length > 0) {
                 const catConditions = categories.map((c: string) => or(
                     ilike(products.category, `%${c}%`),
                     ilike(products.name, `%${c}%`),
                     ilike(products.description, `%${c}%`)
                 ));
                 conditions.push(or(...catConditions));
            }

            if (colors.length > 0) {
                 const colorConditions = colors.map((c: string) => or(
                     ilike(products.description, `%${c}%`),
                     ilike(products.name, `%${c}%`)
                 ));
                 conditions.push(or(...colorConditions));
            }

             if (occasions.length > 0) {
                 const occConditions = occasions.map((o: string) => or(
                     ilike(products.description, `%${o}%`),
                     ilike(products.name, `%${o}%`)
                 ));
                 conditions.push(or(...occConditions));
            }

             if (keywords.length > 0) {
                 const kwConditions = keywords.map((k: string) => or(
                     ilike(products.description, `%${k}%`),
                     ilike(products.name, `%${k}%`),
                     ilike(products.brand, `%${k}%`)
                 ));
                 conditions.push(or(...kwConditions));
            }
        }

        // Fetch products
        let resultProducts = await db.query.products.findMany({
            where: and(...conditions),
            limit: 4,
            orderBy: [desc(products.rating)]
        });

        // Fallback if 0 results but we had terms -> Relax to OR logic on all terms
        if (resultProducts.length === 0 && allTerms.length > 0) {
             const relaxedConditions: SQL[] = [eq(products.isActive, true)];
             const termConditions = allTerms.map((t: string) => or(
                 ilike(products.name, `%${t}%`),
                 ilike(products.description, `%${t}%`),
                 ilike(products.category, `%${t}%`)
             ));
             relaxedConditions.push(or(...termConditions));

             resultProducts = await db.query.products.findMany({
                where: and(...relaxedConditions),
                limit: 4,
                orderBy: [desc(products.rating)]
            });
        }

        // Final fallback to popular if still empty
        if (resultProducts.length === 0 && allTerms.length === 0) {
             if (reply.toLowerCase().includes("here are")) {
                  resultProducts = await db.query.products.findMany({
                    where: eq(products.isActive, true),
                    limit: 4,
                    orderBy: [desc(products.rating)]
                });
             }
        }

        return NextResponse.json({
            message: reply,
            products: resultProducts
        });

    } catch (error) {
        log.error("AI Stylist Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
