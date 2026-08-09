1. **Implémenter le composant `ARTryOn` (Essayage Virtuel RA)**
   - Utiliser `write_file` pour créer/écraser `src/components/shop/ai/ARTryOn.tsx` (j'ai déjà créé ce fichier dans mon exploration avec une première version).
   - Ce composant utilise la caméra de l'utilisateur (`getUserMedia`) et simule un placement AR.

2. **Intégrer le composant dans la page Produit**
   - Utiliser `replace_with_git_merge_diff` pour éditer `src/app/app/shop/product/[id]/page.tsx`.
   - Ajouter le bouton `AR Try-On` au niveau de l'image principale (en haut de la page) ou à côté du "AI Fit Check".
   - Gérer l'état d'ouverture/fermeture du composant.

3. **Mettre à jour le BottomNav pour remettre les composants manquants**
   - Utiliser `replace_with_git_merge_diff` sur `src/components/BottomNav.tsx` pour enlever le commentaire autour du "AI Stylist" si pertinent, bien que la priorité soit AR Try-On. *Optionnel* - Je vais me concentrer sur AR Try-On selon la roadmap.

4. **Compléter les tests ou corriger le linter**
   - Faire un `bun run lint` et `bun run build`.

5. **Compléter les étapes de pre-commit**
   - Utiliser `pre_commit_instructions` pour assurer les tests et vérifications nécessaires.

6. **Générer le rapport final**
   - Créer `reports/YYYY-MM-DD_HH.md`.

7. **Submit**
   - Utiliser l'outil `submit`.
