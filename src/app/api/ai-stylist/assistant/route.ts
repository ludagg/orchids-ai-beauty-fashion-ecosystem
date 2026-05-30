import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { salons } from "@/db/schema/salons";
import { ilike, or, eq, desc } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to keyword matching for assistant.");

            const normalizedMessage = message.toLowerCase();
            let intentType = 'product';
            if (normalizedMessage.includes('salon') || normalizedMessage.includes('hair') || normalizedMessage.includes('nail')) {
                intentType = 'salon';
            }

            let results = [];
            if (intentType === 'salon') {
                results = await db.query.salons.findMany({
                    where: eq(salons.status, 'active'),
                    limit: 3,
                    orderBy: [desc(salons.averageRating)]
                });
            } else {
                results = await db.query.products.findMany({
                    where: eq(products.status, 'ACTIVE'),
                    limit: 3,
                    orderBy: [desc(products.rating)]
                });
            }

            return NextResponse.json({
                reply: `I can help with that! Here are some top ${intentType}s:`,
                intentType,
                results
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a helpful Beauty & Style Assistant for the app "Rare".
            A user has sent you a message asking for advice, products, or salons.

            User Message: "${message}"

            Analyze the message and determine:
            1. The "intentType": either "salon" (if they are looking for services, haircuts, nails, makeup artists) or "product" (if they are looking to buy items like clothing, shoes, skincare).
            2. "keywords": up to 3 keywords describing what they want (e.g., "red dress", "balayage", "summer skincare").
            3. "reply": A friendly, helpful text response to the user's message acting as their personal stylist/assistant.

            Return ONLY a valid JSON object with this structure:
            {
                "intentType": "salon" | "product",
                "keywords": ["keyword1", "keyword2"],
                "reply": "Your conversational reply here"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const parsedResponse = JSON.parse(jsonString);
        const { intentType, keywords, reply } = parsedResponse;

        let dbResults = [];

        if (intentType === 'salon') {
            const conditions = [eq(salons.status, 'active')];
            if (keywords && keywords.length > 0) {
                const kwConditions = keywords.map((kw: string) => or(
                    ilike(salons.name, `%${kw}%`),
                    ilike(salons.description, `%${kw}%`)
                ));
                conditions.push(or(...kwConditions) as any); // Type coercion for simplicity in the array unpack
            }

            dbResults = await db.query.salons.findMany({
                where: (salons, { and }) => and(...conditions),
                limit: 3,
                orderBy: [desc(salons.averageRating)]
            });

        } else {
            const conditions = [eq(products.status, 'ACTIVE')];
            if (keywords && keywords.length > 0) {
                 const kwConditions = keywords.map((kw: string) => or(
                     ilike(products.name, `%${kw}%`),
                     ilike(products.mainCategory, `%${kw}%`),
                     ilike(products.description, `%${kw}%`)
                 ));
                 conditions.push(or(...kwConditions) as any);
            }

            dbResults = await db.query.products.findMany({
                where: (products, { and }) => and(...conditions),
                limit: 3,
                orderBy: [desc(products.rating)]
            });
        }

        return NextResponse.json({
            reply,
            intentType,
            results: dbResults
        });

    } catch (error) {
        console.error("AI Beauty Assistant Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
