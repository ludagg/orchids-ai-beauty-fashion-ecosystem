import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
    if (process.env.GEMINI_API_KEY) {
        return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return null;
};

// Fallback algorithm if AI is unavailable
function calculateFallbackFit(productData: any, measurements: any) {
    const height = parseInt(measurements.height);

    let recommendedSize = "M"; // default
    if (height < 165) recommendedSize = "S";
    if (height > 180) recommendedSize = "L";
    if (height > 190) recommendedSize = "XL";

    // Verify size exists in product
    const availableSizes = productData.sizes?.map((s: any) => s.name) || ["S", "M", "L", "XL"];
    if (!availableSizes.includes(recommendedSize)) {
        recommendedSize = availableSizes[0] || "One Size";
    }

    return {
        recommendedSize,
        confidenceScore: 85,
        analysis: `Based on your height (${measurements.height}cm) and weight (${measurements.weight}kg), size ${recommendedSize} should provide a comfortable fit.`
    };
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productData, measurements } = body;

        if (!measurements?.height || !measurements?.weight) {
            return NextResponse.json({ error: "Missing measurements" }, { status: 400 });
        }

        const genAI = getGenAI();

        if (genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `
                    You are an expert fashion stylist and AI Fit analyst.
                    I have a customer with the following measurements:
                    - Height: ${measurements.height} cm
                    - Weight: ${measurements.weight} kg
                    - Body Type: ${measurements.bodyType || "Not specified"}

                    They are looking at the following product:
                    - Name: ${productData.name}
                    - Brand: ${productData.brand}
                    - Available Sizes: ${JSON.stringify(productData.sizes?.map((s: any) => s.name) || ["S", "M", "L", "XL"])}
                    - Description: ${productData.description}

                    Analyze their fit and recommend a size.
                    Respond ONLY with a JSON object in this exact format, with no markdown formatting or other text:
                    {
                        "recommendedSize": "M",
                        "confidenceScore": 92,
                        "analysis": "A brief, 2-sentence explanation of why this size is recommended based on their measurements."
                    }
                `;

                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                // Clean markdown from response
                const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                const aiRecommendation = JSON.parse(cleanJson);

                return NextResponse.json(aiRecommendation);

            } catch (aiError) {
                console.error("AI Analysis Failed, falling back:", aiError);
                // Fallthrough to fallback algorithm
            }
        }

        // Use fallback if no AI key or AI failed
        const fallbackRecommendation = calculateFallbackFit(productData, measurements);
        return NextResponse.json(fallbackRecommendation);

    } catch (error) {
        console.error("Error in AI Fit Check:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
