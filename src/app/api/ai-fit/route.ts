import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key_for_build");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        try {
            await limiter.check(5, `ai-fit-${ip}`); // 5 requests per minute
        } catch {
             return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        // 2. Authentication
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 3. Parse Request Body
        const body = await req.json();
        const { productDetails } = body;

        if (!productDetails || !productDetails.sizes || productDetails.sizes.length === 0) {
            return NextResponse.json({ error: "Product details with sizes are required" }, { status: 400 });
        }

        // 4. Fetch User Fit Profile
        const userProfile = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: {
                height: true,
                weight: true,
                bodyType: true,
                gender: true
            }
        });

        if (!userProfile) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        const { height, weight, bodyType, gender } = userProfile;

        // If critical measurements are missing, we can't do a good fit check
        if (!height || !weight) {
             return NextResponse.json({
                 error: "Incomplete profile",
                 message: "Please add your height and weight to your profile for AI Fit Check.",
                 requiresProfileUpdate: true
             }, { status: 400 });
        }

        const availableSizes = productDetails.sizes.map((s: any) => s.name).join(", ");
        const productName = productDetails.name || "Unknown Product";
        const productBrand = productDetails.brand || "Unknown Brand";

        // 5. Build AI Prompt
        const prompt = `
            You are an expert AI fashion stylist and sizing assistant.

            User Profile:
            - Height: ${height}
            - Weight: ${weight}
            - Body Type: ${bodyType || "Not specified"}
            - Gender: ${gender || "Not specified"}

            Product Information:
            - Name: ${productName}
            - Brand: ${productBrand}
            - Available Sizes: ${availableSizes}

            Task:
            Based on the user's measurements and the brand's typical sizing, recommend the best size from the available sizes.
            Also provide a confidence score (High, Medium, Low) and a brief, helpful 1-2 sentence explanation of your reasoning (e.g., "This brand typically runs slightly small. Based on your height and weight, size M should provide a comfortable fit without being too tight.").

            Output format MUST be valid JSON:
            {
                "recommendedSize": "The specific size string from available sizes",
                "confidence": "High" | "Medium" | "Low",
                "reason": "Your brief explanation string"
            }
        `;

        // 6. Call Gemini API
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Try to parse the JSON response
        let aiRecommendation;
        try {
            // Strip markdown formatting if Gemini returns it
            const cleanJson = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
            aiRecommendation = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse Gemini response:", responseText);
            return NextResponse.json({ error: "Failed to generate valid recommendation" }, { status: 500 });
        }

        // Validate the extracted recommendation
        if (!aiRecommendation.recommendedSize || !aiRecommendation.reason) {
             return NextResponse.json({ error: "Invalid recommendation format received from AI" }, { status: 500 });
        }

        return NextResponse.json(aiRecommendation);

    } catch (error: any) {
        console.error("AI Fit Check Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
