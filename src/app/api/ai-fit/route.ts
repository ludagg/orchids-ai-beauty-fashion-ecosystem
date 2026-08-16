import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        return null;
    }
    return new GoogleGenerativeAI(apiKey);
};

interface AIFitRequest {
    productId: string;
    productName: string;
    brand: string;
    availableSizes: { name: string }[];
    userMeasurements: {
        height?: string;
        weight?: string;
        bodyType?: string;
    };
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session || !session.user) {
             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body: AIFitRequest = await req.json();
        const { productName, brand, availableSizes, userMeasurements } = body;

        if (!productName || !brand || !availableSizes || availableSizes.length === 0) {
            return NextResponse.json({ error: "Missing required product information" }, { status: 400 });
        }

        const { height, weight, bodyType } = userMeasurements;

        if (!height || !weight || !bodyType) {
            return NextResponse.json({
                error: "Missing user measurements",
                recommendation: null,
                confidence: 0,
                reasoning: "We need your height, weight, and body type to recommend a size."
            }, { status: 400 });
        }

        const genAI = getGenAI();

        if (genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `
                    You are an expert AI fashion stylist and fit specialist.
                    Your task is to recommend the best size for a user based on their measurements and the brand's typical sizing.

                    Product: ${productName}
                    Brand: ${brand}
                    Available Sizes: ${availableSizes.map(s => s.name).join(', ')}

                    User Profile:
                    - Height: ${height}
                    - Weight: ${weight}
                    - Body Type: ${bodyType}

                    Analyze the brand's fit (e.g., does it run large or small?) and the user's measurements.
                    Provide a JSON response with the following format exactly:
                    {
                        "recommendedSize": "the best matching size from the available sizes",
                        "confidence": a number between 0 and 100,
                        "reasoning": "a short, 1-2 sentence explanation tailored to the user"
                    }
                    Do not include any markdown formatting or extra text outside the JSON.
                `;

                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                // Clean the response in case the model wraps it in markdown code blocks
                const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
                const aiRecommendation = JSON.parse(jsonStr);

                // Verify the recommended size is actually available
                const sizeExists = availableSizes.some(s => s.name.toLowerCase() === aiRecommendation.recommendedSize?.toLowerCase());

                if (sizeExists && aiRecommendation.recommendedSize && aiRecommendation.confidence && aiRecommendation.reasoning) {
                     return NextResponse.json({
                         recommendation: aiRecommendation.recommendedSize,
                         confidence: aiRecommendation.confidence,
                         reasoning: aiRecommendation.reasoning
                     });
                }
            } catch (aiError) {
                console.error("AI Size generation failed, falling back to local heuristic:", aiError);
                // Fallthrough to local heuristic
            }
        }

        // --- Local Heuristic Fallback ---

        let recommendedSize = "M"; // Default fallback
        let confidence = 60;
        let reasoning = "Based on average standard sizing for your profile.";

        // Simple heuristic (very basic, just for fallback)
        const heightNum = parseInt(height.replace(/[^0-9]/g, '')); // Try to extract numbers (e.g. 170 from "170 cm")
        const weightNum = parseInt(weight.replace(/[^0-9]/g, ''));

        if (!isNaN(heightNum) && !isNaN(weightNum)) {
             if (heightNum > 185 || weightNum > 90) {
                 recommendedSize = "XL";
                 reasoning = "Based on your height and weight, an XL should provide a comfortable fit.";
                 confidence = 75;
             } else if (heightNum > 175 || weightNum > 75) {
                 recommendedSize = "L";
                 reasoning = "An L should offer the right length and fit for your proportions.";
                 confidence = 80;
             } else if (heightNum < 160 || weightNum < 55) {
                 recommendedSize = "S";
                 reasoning = "Given your measurements, size S is recommended for the best fit.";
                 confidence = 80;
             } else {
                 recommendedSize = "M";
                 reasoning = "Size M aligns well with standard sizing for your body type.";
                 confidence = 85;
             }
        }

        // Ensure the heuristic size is actually in the available sizes
        const availableSizeNames = availableSizes.map(s => s.name.toUpperCase());
        if (!availableSizeNames.includes(recommendedSize)) {
            // If the recommended size isn't available, just pick the middle one as a safe bet
             const middleIndex = Math.floor(availableSizes.length / 2);
             if (availableSizes[middleIndex]) {
                 recommendedSize = availableSizes[middleIndex].name;
                 confidence = 50;
                 reasoning = `Based on availability, ${recommendedSize} is the closest match we have.`;
             } else {
                  return NextResponse.json({
                      error: "Could not determine a fitting size from available options",
                      recommendation: null,
                      confidence: 0,
                      reasoning: "Please refer to the brand's size guide."
                  }, { status: 404 });
             }
        }

        // Brand adjustments (simple mock logic)
        if (brand.toLowerCase().includes("zara") && recommendedSize !== "XL" && availableSizeNames.includes(availableSizes[availableSizes.length - 1]?.name)) {
             // Example: Zara runs small, size up if possible
             const currentIndex = availableSizeNames.indexOf(recommendedSize);
             if (currentIndex < availableSizeNames.length - 1) {
                 recommendedSize = availableSizeNames[currentIndex + 1];
                 reasoning += " (Note: This brand typically runs small, so we sized up for you.)";
             }
        }

        return NextResponse.json({
            recommendation: recommendedSize,
            confidence: confidence,
            reasoning: reasoning
        });

    } catch (error) {
        console.error("Error in AI Fit Check API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
