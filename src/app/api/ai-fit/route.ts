import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the model lazily inside the handler to ensure env variables are loaded correctly
function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

function localHeuristicFallback(height: string, weight: string, bodyType: string, sizes: any[]) {
    if (!sizes || sizes.length === 0) return { size: null, confidence: 0 };

    // Very simple heuristic
    let recommendedSize = sizes[0].name;
    const h = parseInt(height, 10);
    const w = parseInt(weight, 10);

    if (!isNaN(h) && !isNaN(w)) {
        if (h > 180 && w > 80) recommendedSize = sizes.find(s => ['L', 'XL', 'XXL'].includes(s.name))?.name || sizes[sizes.length - 1].name;
        else if (h < 165 && w < 60) recommendedSize = sizes.find(s => ['XS', 'S'].includes(s.name))?.name || sizes[0].name;
        else recommendedSize = sizes.find(s => s.name === 'M')?.name || sizes[Math.floor(sizes.length / 2)].name;
    }

    return { size: recommendedSize, confidence: 60 };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { height, weight, bodyType, product } = body;

    if (!product || !product.sizes || product.sizes.length === 0) {
      return NextResponse.json({ error: 'Product or sizes not provided' }, { status: 400 });
    }

    const model = getModel();
    if (!model) {
      // Fallback if no API key
      const result = localHeuristicFallback(height, weight, bodyType, product.sizes);
      return NextResponse.json(result);
    }

    const prompt = `
      You are an expert fashion stylist and AI Fit Check system.
      A user wants to buy a product.
      User Measurements:
      - Height: ${height || 'Unknown'}
      - Weight: ${weight || 'Unknown'}
      - Body Type: ${bodyType || 'Unknown'}

      Product: ${product.name}
      Available Sizes: ${product.sizes.map((s: any) => s.name).join(', ')}

      Based on these details, recommend the best size for the user.
      Respond ONLY with a valid JSON object in the following format, with no markdown formatting or extra text:
      {
        "size": "The recommended size (e.g., 'M')",
        "confidence": "A number between 0 and 100 representing your confidence in this recommendation"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();

    try {
        const json = JSON.parse(text);
        if (json.size && json.confidence) {
             return NextResponse.json({ size: json.size, confidence: parseInt(json.confidence, 10) });
        }
    } catch (e) {
        console.error("Failed to parse Gemini response:", text);
    }

    // Fallback if AI fails to return valid JSON
    return NextResponse.json(localHeuristicFallback(height, weight, bodyType, product.sizes));

  } catch (error) {
    console.error('AI Fit Error:', error);
    // Ultimate fallback
    return NextResponse.json({ size: null, confidence: 0, error: 'Failed to calculate fit' }, { status: 500 });
  }
}
