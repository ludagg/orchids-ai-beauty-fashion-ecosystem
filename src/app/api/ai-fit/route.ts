import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Basic sanitization
function sanitizeInput(str: string): string {
    if (!str) return '';
    return str.replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { product, measurements } = body;

        if (!product) {
            return NextResponse.json({ error: "Product details are required" }, { status: 400 });
        }

        const height = sanitizeInput(measurements?.height || '');
        const weight = sanitizeInput(measurements?.weight || '');
        const bodyType = sanitizeInput(measurements?.bodyType || '');

        const prompt = `
            Analyze the fit for this product based on the user's measurements.
            Product: ${product.name}, Description: ${product.description}.
            User Measurements: Height ${height || 'Unknown'}, Weight ${weight || 'Unknown'}, Body Type ${bodyType || 'Unknown'}.
            Provide a recommended size and a brief explanation (max 3 sentences).
            Respond strictly in JSON format like this:
            { "recommendedSize": "M", "explanation": "Based on your height and body type, M should provide a comfortable fit." }
        `;

        const apiKey = process.env.GEMINI_API_KEY;
        let aiResult = null;

        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                // Attempt to parse JSON from markdown code blocks or plain text
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
             let recommendedSize = "M";
             let explanation = "Based on general sizing guidelines, this should be a good fit.";

             if (height && height.includes('18')) recommendedSize = "L";
             else if (weight && parseInt(weight) > 80) recommendedSize = "L";
             else if (bodyType && bodyType.toLowerCase().includes('slim')) recommendedSize = "S";

             aiResult = {
                 recommendedSize,
                 explanation: `(Fallback) ${explanation}`
             };
        }

        return NextResponse.json(aiResult);

    } catch (error) {
        console.error("Error in AI Fit Check:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
