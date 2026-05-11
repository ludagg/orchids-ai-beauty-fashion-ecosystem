1. Ajouter les tests unitaires pour le fichier `src/lib/email-templates.ts` en le plaçant dans `src/lib/email-templates.test.ts`. Les tests vérifieront que les fonctions `bookingConfirmation`, `bookingCancellation` et `orderConfirmation` retournent les templates HTML avec les données correctes.
2. Corriger la configuration de Next.js (`next.config.ts`) pour retirer la configuration invalide de `turbopack` qui provoquait des erreurs lors du `next build`.
3. Ajouter un rapport d'exécution (`reports/2026-05-11_23.md`) pour documenter les actions, l'avancement, et les blocages selon la directive `AGENTS.md`.
4. Lancer une passe de tests unitaires et de compilation (`bun test` et `bun run build`) pour vérifier l'état du dépôt.
5. Complete pre commit steps to make sure proper testing, verifications, reviews and reflections are done.
6. Submit the change.
