import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing GEMINI_API_KEY environment variable.");
            return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
        }

        // Initialize inside the function to pick up mocked env vars in tests
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const formData = await req.formData();
        const image = formData.get("image") as File | null;

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = image.type;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "You are an AI assistant for a fashion, beauty, and salon marketplace. Analyze the following image. Extract the most prominent fashion item, beauty product, or hairstyle shown. Provide a short, concise search query (1 to 4 words maximum) that a user would type into a search bar to find similar items or services. Respond ONLY with the search query, without any quotes, punctuation, or extra text.";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType
                }
            }
        ]);

        const response = await result.response;
        const text = response.text().trim();

        if (!text) {
             return NextResponse.json({ error: "Could not analyze image" }, { status: 422 });
        }

        return NextResponse.json({ query: text });

    } catch (error) {
        console.error("Error analyzing image:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
