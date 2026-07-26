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

// Fallback logic for when Gemini isn't available or fails
function getLocalComparison(items: any[]) {
    if (!items || items.length < 2) {
        return {
             summary: "Not enough items to compare.",
             features: [],
             recommendation: "Please select at least two items to compare.",
             winnerId: null
        };
    }

    const item1 = items[0];
    const item2 = items[1];

    const priceDiff = item1.originalPrice - item2.originalPrice;
    let recommendation = "";
    let winnerId = null;

    if (priceDiff > 0) {
        recommendation = `${item2.name} is more affordable, but ${item1.name} might offer premium features.`;
        winnerId = item2.id;
    } else if (priceDiff < 0) {
        recommendation = `${item1.name} is more affordable, but ${item2.name} might offer premium features.`;
        winnerId = item1.id;
    } else {
        recommendation = `Both items are similarly priced.`;
    }

    return {
        summary: `Comparing ${item1.name} and ${item2.name}.`,
        features: [
            {
                name: "Price",
                item1Value: (item1.originalPrice / 100).toString(),
                item2Value: (item2.originalPrice / 100).toString(),
                betterFor: winnerId
            },
            {
                name: "Brand",
                item1Value: item1.brand || "Unknown",
                item2Value: item2.brand || "Unknown",
                betterFor: null
            },
            {
                 name: "Rating",
                 item1Value: item1.rating?.toString() || "N/A",
                 item2Value: item2.rating?.toString() || "N/A",
                 betterFor: (item1.rating || 0) > (item2.rating || 0) ? item1.id : (item2.rating || 0) > (item1.rating || 0) ? item2.id : null
            }
        ],
        recommendation,
        winnerId
    };
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
        const { items } = body;

        if (!items || !Array.isArray(items) || items.length < 2) {
            return NextResponse.json({ error: "At least two items are required for comparison" }, { status: 400 });
        }

        const genAI = getGenAI();

        if (!genAI) {
            console.log("No Gemini API key, using local fallback");
            return NextResponse.json(getLocalComparison(items));
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
            You are an AI Shopping Assistant. Compare the following items and provide a detailed analysis to help the user choose.

            Items:
            ${items.map((item, index) => `
            Item ${index + 1}:
            ID: ${item.id}
            Name: ${item.name}
            Brand: ${item.brand || "N/A"}
            Price: ${item.originalPrice / 100}
            Description: ${item.description || "N/A"}
            Rating: ${item.rating || "N/A"}
            `).join("\n")}

            Analyze the items. Respond ONLY in valid JSON format matching this schema:
            {
                "summary": "A brief overview of the comparison",
                "features": [
                    {
                        "name": "Feature Name (e.g. Price, Quality, Value)",
                        "item1Value": "Value for item 1",
                        "item2Value": "Value for item 2",
                        "betterFor": "ID of the item that is better for this feature, or null if tie"
                    }
                ],
                "recommendation": "Final recommendation based on the comparison",
                "winnerId": "ID of the recommended item, or null if it's too close to call"
            }
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
            const aiData = JSON.parse(jsonStr);

            return NextResponse.json(aiData);

        } catch (aiError) {
             console.error("AI Gen Error:", aiError);
             return NextResponse.json(getLocalComparison(items));
        }

    } catch (error: any) {
        console.error("Compare API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}