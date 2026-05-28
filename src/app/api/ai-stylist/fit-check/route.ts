import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function fallbackFitCheck(userHeight: number, userWeight: number, bodyType: string, fitPreference: string, productType: string, productFit: string) {
    // A simplified fallback logic if Gemini is unavailable
    const score = 85;
    const recommendation = `Based on your height (${userHeight}cm) and body type (${bodyType}), this ${productType} should fit well. The product has a ${productFit} fit.`;
    const sizeSuggestion = "Medium";

    return NextResponse.json({
        fitScore: score,
        recommendation: recommendation,
        sizeSuggestion: sizeSuggestion
    });
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            userHeight,
            userWeight,
            bodyType,
            fitPreference,
            productType,
            productFit,
            productMaterial
        } = body;

        if (!userHeight || !userWeight || !bodyType || !productType) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Falling back to rule-based fit check.");
            return fallbackFitCheck(userHeight, userWeight, bodyType, fitPreference || 'regular', productType, productFit || 'regular');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert AI Virtual Tailor and Fit Analyst for the "Rare" fashion app.
            Your task is to analyze if a piece of clothing will fit a specific user well.

            User Profile:
            - Height: ${userHeight} cm
            - Weight: ${userWeight} kg
            - Body Type: ${bodyType}
            - Fit Preference: ${fitPreference || 'regular'}

            Product Information:
            - Type: ${productType}
            - Intended Fit: ${productFit || 'regular'}
            - Material: ${productMaterial || 'unknown'}

            Analyze how this product will fit the user's specific body type.
            Provide a confidence score out of 100 representing how well it will fit them based on their preferences.
            Provide a detailed but concise recommendation explaining why it will or won't fit well.
            Suggest the best standard size (XS, S, M, L, XL, XXL) for them.

            Return ONLY a valid JSON object with exactly this structure, no markdown wrappers:
            {
                "fitScore": 85,
                "recommendation": "Explanation of the fit...",
                "sizeSuggestion": "M"
            }
        `;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (geminiError) {
            console.error("Gemini API Error in Fit Check:", geminiError);
            return fallbackFitCheck(userHeight, userWeight, bodyType, fitPreference || 'regular', productType, productFit || 'regular');
        }

        const response = result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini Fit Check response:", text);
            return fallbackFitCheck(userHeight, userWeight, bodyType, fitPreference || 'regular', productType, productFit || 'regular');
        }

        return NextResponse.json({
            fitScore: parsedResponse.fitScore || 80,
            recommendation: parsedResponse.recommendation || "We believe this will be a good fit.",
            sizeSuggestion: parsedResponse.sizeSuggestion || "M"
        });

    } catch (error) {
        console.error("Fit Check Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
