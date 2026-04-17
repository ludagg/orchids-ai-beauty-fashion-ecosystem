import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "@/lib/logger";

// [Jules - Created AI Product & Service Comparison endpoint as per SPECIFICATIONS.md]
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, type, userPreferences } = body;

        if (!items || !Array.isArray(items) || items.length < 2) {
            return NextResponse.json({ error: "At least two items are required for comparison" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            logger.warn("GEMINI_API_KEY is missing. Falling back to dummy comparison response.");
            return NextResponse.json({
                comparisonData: [
                    {
                        itemId: items[0]?.id || "item-1",
                        pros: ["Bon prix", "Matériau de qualité"],
                        cons: ["Livraison un peu longue"],
                        verdict: "Meilleur rapport qualité-prix"
                    },
                    {
                        itemId: items[1]?.id || "item-2",
                        pros: ["Livraison rapide", "Marque reconnue"],
                        cons: ["Plus cher"],
                        verdict: "Option premium"
                    }
                ],
                overallRecommendation: "Le premier article est idéal si vous avez un budget strict.",
                isFallback: true
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Tu es un expert en comparaison pour la plateforme Priisme (mode, beauté, salons).
Ton rôle est d'analyser la liste d'articles (produits ou services) suivante et d'aider l'utilisateur à faire le meilleur choix.

Type de comparaison: ${type || 'Non spécifié'}
Préférences de l'utilisateur: ${userPreferences ? JSON.stringify(userPreferences) : 'Aucune préférence spécifique'}

Articles à comparer:
${JSON.stringify(items, null, 2)}

Analyse ces données et retourne UNIQUEMENT un objet JSON avec la structure suivante, sans aucun autre texte:
{
  "comparisonData": [
    {
      "itemId": "l'ID de l'article",
      "pros": ["Avantage 1", "Avantage 2"],
      "cons": ["Inconvénient 1"],
      "verdict": "Un court verdict pour cet article (ex: Meilleur rapport qualité/prix, Option premium)"
    }
  ],
  "overallRecommendation": "Une recommandation globale personnalisée en une phrase ou deux expliquant quel choix faire."
}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let parsedResult;
        try {
            // Remove markdown code blocks if any
            const jsonStr = responseText.replace(/```json\n/g, '').replace(/```\n/g, '').replace(/```/g, '');
            parsedResult = JSON.parse(jsonStr);
        } catch (e) {
            logger.error({ error: e, responseText }, "Failed to parse Gemini response for AI Comparison");
            return NextResponse.json({
                error: "Failed to parse comparison data.",
                rawResponse: responseText
            }, { status: 500 });
        }

        return NextResponse.json(parsedResult);
    } catch (error) {
        logger.error({ error }, "Error in AI Comparison endpoint");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
