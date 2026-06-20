import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { GoogleGenerativeAI } from '@google/generative-ai';

// In a real implementation, you'd pass the actual product details here.
// For now, we'll just mock the incoming request expecting `productId`.
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, brand, mainCategory, subcategory } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { height: true, weight: true, bodyType: true }
    });

    // If API key is missing or user has no measurements, provide a fallback.
    if (!process.env.GEMINI_API_KEY || (!user?.height && !user?.weight && !user?.bodyType)) {
      return NextResponse.json({
        recommendation: "M",
        confidence: 0.7,
        reasoning: "Based on standard sizing for this category. Add your measurements to your profile for better accuracy."
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI stylist and fit predictor.
      Recommend the best size (XS, S, M, L, XL, XXL) for a user with the following profile:
      Height: ${user?.height || 'Unknown'}
      Weight: ${user?.weight || 'Unknown'}
      Body Type: ${user?.bodyType || 'Unknown'}

      For a product with these details:
      Brand: ${brand || 'Unknown'}
      Category: ${mainCategory || 'Clothing'} / ${subcategory || 'Unknown'}

      Return a JSON object with:
      - recommendation: string (the size, e.g. "M")
      - confidence: number (0.0 to 1.0)
      - reasoning: string (a short, friendly explanation)
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Attempt to parse JSON from the response
    let parsedResponse;
    try {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0].replace(/```json\n|```/g, '') : responseText;
      parsedResponse = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
       parsedResponse = {
        recommendation: "M",
        confidence: 0.5,
        reasoning: "We couldn't generate a highly confident recommendation right now. Consider checking the brand's size guide."
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('AI Fit error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendation' }, { status: 500 });
  }
}
