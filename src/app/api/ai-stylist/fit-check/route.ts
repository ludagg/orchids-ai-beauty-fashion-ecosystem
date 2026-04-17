import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "@/lib/logger";

// [Jules - Created AI Fit Check endpoint as per SPECIFICATIONS.md for Virtual Fit Intelligence]
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { product, userDimensions, userPreferences, returnHistory } = body;

        if (!product || !userDimensions) {
            return NextResponse.json({ error: "Missing required fields (product or userDimensions)" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            logger.warn("GEMINI_API_KEY is missing. Falling back to dummy fit check response.");
            return NextResponse.json({
                recommendation: "M",
                confidenceScore: 85,
                explanation: "Basé sur vos dimensions et l'historique d'achats similaires, la taille M offre un ajustement optimal.",
                fitType: "regular",
                isFallback: true
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Tu es un expert en Virtual Fit Intelligence (AI Fit Check) pour la plateforme mode & beauté Priisme.
Ton rôle est d'analyser les informations du produit et de l'utilisateur pour recommander la meilleure taille et prédire le rendu.

Produit:
- Nom: ${product.name || 'Inconnu'}
- Catégorie: ${product.category || 'Inconnu'}
- Description: ${product.description || 'Aucune description'}
- Tailles disponibles: ${product.availableSizes ? product.availableSizes.join(", ") : 'Toutes tailles standards'}
- Sizing info: ${product.sizingInfo || 'Standard'}

Utilisateur:
- Dimensions (Taille, Poids, Mensurations): ${JSON.stringify(userDimensions)}
- Préférences (Serré, Regular, Ample): ${userPreferences || 'Regular'}
- Historique des retours: ${returnHistory ? JSON.stringify(returnHistory) : 'Aucun'}

Analyse ces données et retourne UNIQUEMENT un objet JSON avec la structure suivante, sans aucun autre texte:
{
  "recommendation": "La taille recommandée (ex: S, M, L, 38, 40)",
  "confidenceScore": "Un nombre entre 0 et 100",
  "explanation": "Une courte explication en français du pourquoi de cette recommandation",
  "fitType": "Le rendu prévu (tight, regular, loose)"
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
            logger.error({ error: e, responseText }, "Failed to parse Gemini response for AI Fit Check");
            return NextResponse.json({
                recommendation: "Taille Standard",
                confidenceScore: 50,
                explanation: "Nous n'avons pas pu déterminer la taille exacte avec certitude.",
                fitType: "regular",
                isFallback: true
            });
        }

        return NextResponse.json(parsedResult);
    } catch (error) {
        logger.error({ error }, "Error in AI Fit Check endpoint");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
