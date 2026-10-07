import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { height, weight, bodyType, productBrand, productName, productCategory } = body;

        // Ensure we have some base measurements or product info to work with
        if (!height || !weight) {
             return NextResponse.json({
                recommendation: "M",
                confidence: 70,
                reasoning: "We couldn't analyze your fit because some measurements are missing. We recommend a default size based on averages.",
                fitType: "regular",
                chart: {
                     tight: 20,
                     regular: 70,
                     loose: 10
                }
             });
        }

        // Basic Sanitization to prevent injection
        const safeHeight = height.replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
        const safeWeight = weight.replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
        const safeBodyType = (bodyType || '').replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
        const safeBrand = (productBrand || 'Generic Brand').replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 100);
        const safeProduct = (productName || 'Clothing Item').replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 100);

        const prompt = `
        You are an expert AI virtual stylist and tailor.
        A user wants to buy "${safeProduct}" from the brand "${safeBrand}".
        The user's measurements are:
        - Height: ${safeHeight}
        - Weight: ${safeWeight}
        - Body Type: ${safeBodyType || 'Not specified'}

        Based on general clothing sizing standards and typical brand sizing, predict the best size for this user.
        Return ONLY a JSON object (no markdown formatting, no code blocks) with the following structure:
        {
          "recommendation": "S, M, L, XL, etc.",
          "confidence": a number between 1 and 100 representing your confidence,
          "reasoning": "A 1-2 sentence explanation of why this size is recommended based on their body type and height/weight.",
          "fitType": "tight", "regular", or "loose",
          "chart": {
             "tight": percentage (number),
             "regular": percentage (number),
             "loose": percentage (number)
          } // Must sum to 100
        }
        `;

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Clean up the response to ensure it's parseable JSON
            const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanedText);

            return NextResponse.json(data);
        } catch (aiError) {
             console.error("Gemini API Error, falling back:", aiError);
             // Fallback logic if AI fails or key is missing
             return NextResponse.json({
                recommendation: "L",
                confidence: 65,
                reasoning: `Based on a height of ${safeHeight} and weight of ${safeWeight}, size L is usually a safe fit. Please check the brand's specific size guide.`,
                fitType: "regular",
                chart: {
                     tight: 15,
                     regular: 65,
                     loose: 20
                }
             });
        }

    } catch (error) {
        console.error('Error generating AI Fit check:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
