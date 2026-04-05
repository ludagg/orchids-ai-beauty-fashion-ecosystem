import { NextResponse } from "next/server";

export async function GET() {
    // [Jules - Adding root endpoint for AI Stylist feature healthcheck]
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;

    return NextResponse.json({
        service: "AI Stylist",
        status: "operational",
        mode: hasGeminiKey ? "gemini" : "fallback_keyword_matching",
        version: "v2.0"
    });
}
