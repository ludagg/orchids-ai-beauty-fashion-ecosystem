1. **Implémenter l'API AI Fit Check (`src/app/api/ai-stylist/fit-check/route.ts`)**
   - Créer une nouvelle route API POST.
   - Utiliser `auth.api.getSession` pour vérifier l'authentification.
   - Accepter `productId`, `userProfile` (taille, poids, préférences), et les détails du produit.
   - Utiliser `GoogleGenerativeAI` (`gemini-1.5-flash`) pour analyser ces données et retourner une recommandation structurée (taille, niveau de confiance, explication, rendu).
   - Inclure un fallback structuré (mock) si l'API Key Gemini n'est pas configurée ou échoue.
   - Configurer le rate limiting pour sécuriser l'endpoint.

2. **Mettre à jour le frontend du Produit (`src/app/app/shop/product/[id]/page.tsx`)**
   - Créer un nouveau composant client `AIFitCheck` (ou intégrer la logique dans la page) pour appeler l'API `/api/ai-stylist/fit-check`.
   - Gérer l'état de chargement et l'affichage des résultats dynamiques (taille recommandée, explication, jauge de confiance) au lieu des données en dur ("AI recommends size M for you").
   - Gérer gracieusement les erreurs (afficher un fallback propre ou masquer la feature si l'API échoue).

3. **Implémenter l'API AI Beauty & Style Assistant (`src/app/api/ai-stylist/assistant/route.ts`)**
   - Créer une nouvelle route API POST pour agir comme un chatbot orienté beauté et style.
   - Permettre de recommander des salons, des produits, et de donner des conseils (skincare, outfits).
   - Utiliser Gemini pour parser l'intention, extraire les critères, et formuler une réponse.
   - Intégrer Drizzle ORM pour chercher dans la base de données (salons, produits) en fonction des critères extraits.

4. **Tests et Qualité**
   - Créer `src/app/api/ai-stylist/fit-check/route.test.ts` (ou équivalent) pour tester l'API de fit-check avec des mocks Gemini et DB.
   - Créer `src/app/api/ai-stylist/assistant/route.test.ts` pour tester l'assistant beauté.

5. **Générer le rapport de run**
   - Créer un rapport détaillé dans `reports/2024-05-30_00.md` (date dynamique) avec les actions entreprises, les décisions techniques, et l'avancement.

6. **Pre-commit et Submit**
   - Exécuter `pre_commit_instructions` et valider les changements.
