import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

function sanitizeInput(str: string): string {
    if (!str) return '';
    return str.replace(/[^a-zA-Z0-9., \-]/g, '').substring(0, 500);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items } = body;

        if (!items || !Array.isArray(items) || items.length < 2) {
            return NextResponse.json({ error: "At least two items are required for comparison" }, { status: 400 });
        }

        const itemsDetails = items.map(item =>
            `Name: ${sanitizeInput(item.name)}, Price: ${item.price}, Rating: ${item.rating || 'N/A'}, Description: ${sanitizeInput(item.description || '')}`
        ).join('\n---\n');

        const prompt = `
            Compare the following products or services:
            ${itemsDetails}

            Provide a comparison highlighting the pros and cons of each, and suggest which one might be better suited for different needs.
            Respond strictly in JSON format like this:
            {
                "comparison": "A detailed paragraph comparing them.",
                "recommendation": "A brief final recommendation.",
                "features": { "Item 1 Name": ["Pro 1", "Con 1"], "Item 2 Name": ["Pro 1", "Con 1"] }
            }
        `;

        const apiKey = process.env.GEMINI_API_KEY;
        let aiResult = null;

        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                   aiResult = JSON.parse(jsonMatch[0]);
                }
            } catch (e) {
                console.error("AI API failed, falling back to local algorithm", e);
            }
        }

        // Fallback algorithm
        if (!aiResult) {
             const features: any = {};
             items.forEach(item => {
                 features[item.name] = [`Price: ${item.price}`, `Rating: ${item.rating || 'N/A'}`];
             });

             const cheapest = items.reduce((prev, curr) => (prev.price < curr.price) ? prev : curr);
             const highestRated = items.reduce((prev, curr) => ((prev.rating || 0) > (curr.rating || 0)) ? prev : curr);

             aiResult = {
                 comparison: `(Fallback) Compared ${items.length} items. The cheapest is ${cheapest.name} and the highest rated is ${highestRated.name}.`,
                 recommendation: `Consider ${highestRated.name} for quality or ${cheapest.name} for budget.`,
                 features
             };
        }

        return NextResponse.json(aiResult);

    } catch (error) {
        console.error("Error in AI Compare:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
