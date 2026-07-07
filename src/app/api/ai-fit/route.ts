import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
    const key = process.env.GEMINI_API_KEY || "";
    return {
        key,
        genAI: key ? new GoogleGenerativeAI(key) : null
    };
};

// Fallback algorithm if Gemini is unavailable
function calculateFallbackFit(height: string, weight: string, bodyType: string, productName: string) {
    let size = "M";
    const heightNum = parseInt(height.replace(/[^0-9]/g, ''), 10) || 170;
    const weightNum = parseInt(weight.replace(/[^0-9]/g, ''), 10) || 70;

    if (weightNum < 60 && heightNum < 165) size = "S";
    else if (weightNum > 85 || heightNum > 185) size = "L";
    else if (weightNum > 100) size = "XL";

    if (bodyType.toLowerCase() === 'athletic' && size === 'M') size = 'L'; // Example logic

    const reason = `Based on your profile (${height}, ${weight}, ${bodyType}), we estimate this brand typically runs true to size. Size ${size} should be the best fit for ${productName}.`;

    return { size, reason };
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { height, weight, bodyType, productName, productDescription, productCategory } = body;

        if (!height || !weight || !bodyType) {
            return NextResponse.json({ error: "Missing user measurements" }, { status: 400 });
        }

        if (!productName) {
            return NextResponse.json({ error: "Missing product information" }, { status: 400 });
        }

        // Try using Google Gemini first if key is present and not a dummy key
        const { key, genAI } = getGenAI();
        if (genAI && key !== "your_gemini_api_key_here") {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `
                    You are an expert fashion stylist and AI sizing assistant for an online clothing marketplace.
                    Analyze the following user measurements and product details to recommend the best size (XS, S, M, L, XL, XXL) and explain your reasoning in 2-3 short sentences.
                    Return the result as a JSON string with two keys: "size" and "reason".

                    User Measurements:
                    - Height: ${height}
                    - Weight: ${weight}
                    - Body Type: ${bodyType}

                    Product Details:
                    - Name: ${productName}
                    - Category: ${productCategory || 'Clothing'}
                    - Description: ${productDescription || 'Standard fit'}

                    Return strictly JSON format, no markdown formatting blocks like \`\`\`json.
                `;

                const result = await model.generateContent(prompt);
                const response = result.response;
                let text = response.text();

                // Clean up possible markdown JSON formatting from the LLM response
                text = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

                try {
                    const parsedResponse = JSON.parse(text);
                    if (parsedResponse.size && parsedResponse.reason) {
                        return NextResponse.json({
                            size: parsedResponse.size,
                            reason: parsedResponse.reason,
                            provider: "ai"
                        });
                    }
                } catch (parseError) {
                    console.error("Failed to parse Gemini response as JSON:", text, parseError);
                    // Fallthrough to fallback
                }
            } catch (aiError) {
                console.error("Gemini AI API Error:", aiError);
                // Fallthrough to fallback
            }
        }

        // Fallback to local heuristic
        const fallbackResult = calculateFallbackFit(height, weight, bodyType, productName);

        return NextResponse.json({
            size: fallbackResult.size,
            reason: fallbackResult.reason,
            provider: "fallback"
        });

    } catch (error) {
        console.error("AI Fit Check error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
