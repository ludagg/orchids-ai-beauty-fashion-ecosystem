import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
} else {
    console.warn("GEMINI_API_KEY is not set. AI Fit will use the local fallback algorithm.");
}

function sanitizeInput(input: string | undefined): string {
    if (!input) return '';
    // Allow alphanumeric characters, spaces, dots, and commas. Max 50 chars.
    return input.replace(/[^a-zA-Z0-9., ]/g, '').substring(0, 50);
}

// Basic fallback algorithm for testing or when API key is missing
function localFallbackFitCheck(productName: string, height: string, weight: string, bodyType: string) {
    const defaultResponse = {
        recommendedSize: "M",
        confidenceScore: 75,
        reasoning: "Based on average standard sizing and your inputs.",
        fitType: "regular"
    };

    const w = parseInt(weight);
    const h = parseInt(height);

    if (isNaN(w) || isNaN(h)) return defaultResponse;

    let size = "M";
    let fitType = "regular";
    let score = 80;

    // Very basic heuristic
    if (w < 60 && h < 170) {
        size = "S";
    } else if (w > 85 || h > 185) {
        size = "L";
        if (w > 100) size = "XL";
    } else {
         size = "M";
    }

    if (bodyType.toLowerCase() === 'athletic') {
         fitType = "tight";
         score = 85;
    } else if (bodyType.toLowerCase() === 'curvy') {
         fitType = "regular";
         score = 82;
    }

    return {
        recommendedSize: size,
        confidenceScore: score,
        reasoning: `Based on your height (${height}cm), weight (${weight}kg), and ${bodyType} body type, we suggest size ${size}. This product typically has a ${fitType} fit for your profile.`,
        fitType
    };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productName, height, weight, bodyType } = body;

        const sProductName = sanitizeInput(productName);
        const sHeight = sanitizeInput(height);
        const sWeight = sanitizeInput(weight);
        const sBodyType = sanitizeInput(bodyType);

        if (!sHeight || !sWeight || !sBodyType) {
            return NextResponse.json({ error: 'Missing measurements' }, { status: 400 });
        }

        if (!genAI) {
            // Use local fallback
            const fallbackResult = localFallbackFitCheck(sProductName, sHeight, sWeight, sBodyType);
            return NextResponse.json(fallbackResult);
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert AI fashion stylist and tailor.
            Analyze the following user measurements and recommend the best clothing size.

            Product Name: ${sProductName}
            User Height: ${sHeight}
            User Weight: ${sWeight}
            User Body Type: ${sBodyType}

            Return ONLY a valid JSON object with the following structure, no markdown formatting or extra text:
            {
                "recommendedSize": "S" | "M" | "L" | "XL" | "XXL",
                "confidenceScore": number (0-100),
                "reasoning": "A short 1-2 sentence explanation tailored to the user",
                "fitType": "tight" | "regular" | "loose"
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        try {
            // Clean up the response to handle potential markdown block formatting from the LLM
            let cleanedText = responseText.trim();
            if (cleanedText.startsWith('```json')) {
                cleanedText = cleanedText.substring(7);
            } else if (cleanedText.startsWith('```')) {
                 cleanedText = cleanedText.substring(3);
            }

            if (cleanedText.endsWith('```')) {
                cleanedText = cleanedText.substring(0, cleanedText.length - 3);
            }

            const parsedData = JSON.parse(cleanedText);
            return NextResponse.json(parsedData);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", responseText, parseError);
             // Fallback if parsing fails
             const fallbackResult = localFallbackFitCheck(sProductName, sHeight, sWeight, sBodyType);
             return NextResponse.json(fallbackResult);
        }

    } catch (error) {
        console.error('Error generating AI Fit recommendation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
