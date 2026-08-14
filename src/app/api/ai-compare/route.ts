import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { products } from "@/db/schema/commerce";
import { eq, ne, and, ilike, desc } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { productId, productName, productCategory } = await req.json();

        if (!productId || !productName) {
             return NextResponse.json({ error: "Missing product details" }, { status: 400 });
        }

        // 1. Fetch alternatives from DB
        let dbAlternatives = [];
        try {
             dbAlternatives = await db.query.products.findMany({
                 where: and(
                     eq(products.status, 'ACTIVE'),
                     ne(products.id, productId),
                     productCategory ? ilike(products.mainCategory, `%${productCategory}%`) : undefined
                 ),
                 limit: 3,
                 orderBy: [desc(products.rating)]
             });
        } catch (dbErr) {
             console.warn("Could not fetch DB alternatives for comparison", dbErr);
        }

        // 2. Fallback local generation if no API key
        const getFallbackComparison = () => {
             const alts = dbAlternatives.map(p => ({
                 name: p.name,
                 price: p.salePrice ? `$${(p.salePrice/100).toFixed(2)}` : `$${(p.originalPrice/100).toFixed(2)}`,
                 reason: "Highly rated alternative in the same category."
             }));

             return {
                 summary: `This is a highly rated item in the ${productCategory || 'general'} category. It offers good value for its price point.`,
                 pros: ["Popular choice", "Good value", "Standard fit"],
                 cons: ["May not be unique", "Standard materials"],
                 alternatives: alts.length > 0 ? alts : [
                     { name: "Premium Alternative", reason: "Better materials but higher cost." },
                     { name: "Budget Option", reason: "More affordable but fewer features." }
                 ]
             };
        };

        if (!process.env.GEMINI_API_KEY) {
            console.warn("GEMINI_API_KEY not found. Using fallback for AI Compare.");
            return NextResponse.json(getFallbackComparison());
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const altContext = dbAlternatives.map(a => `${a.name} (Price: ${a.salePrice ? a.salePrice/100 : a.originalPrice/100})`).join(", ");

        const prompt = `
            Act as an expert shopping assistant. Provide a concise comparison analysis for the following product:
            Product Name: "${productName}"
            Category: "${productCategory || 'Unknown'}"

            Available Alternatives in Store: ${altContext || 'None specific'}

            Based on general knowledge of similar products and the provided alternatives, give a balanced review.

            Return ONLY a JSON object with this exact structure:
            {
              "summary": "A 2-3 sentence overall verdict.",
              "pros": ["Pro 1", "Pro 2", "Pro 3"],
              "cons": ["Con 1", "Con 2"],
              "alternatives": [
                 { "name": "Alternative Name", "reason": "Why consider this instead" }
              ]
            }
            Ensure the JSON is valid and contains no markdown formatting. Keep pros/cons short.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        try {
            const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonResponse = JSON.parse(cleanedText);

            // Validate structure
            if (!jsonResponse.summary || !jsonResponse.pros || !jsonResponse.alternatives) {
                 throw new Error("Invalid structure");
            }

            return NextResponse.json(jsonResponse);

        } catch (parseError) {
             console.error("AI Compare Parse Error:", parseError, "Raw:", responseText);
             return NextResponse.json(getFallbackComparison());
        }

    } catch (error) {
        console.error("Error in AI Compare route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
