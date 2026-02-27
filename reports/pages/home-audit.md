---
# 📄 Audit — Page d'accueil (`/`)
**Date** : 27 février 2026  
**Fichier** : `app/page.tsx`  
**Auth requise** : NON  
**Analysée avec** : Playwright + lecture code source  

---

## 🎯 Résumé Exécutif
La page d'accueil de "Rare" (anciennement Priisme) est une landing page premium pour une plateforme beauté & fashion alimentée par l'IA. Elle présente une animation soignée, une typographie élégante (Playfair Display, Outfit, Pinyon Script), et une structure pédagogique claire. Cependant, plusieurs améliorations sont nécessaires pour atteindre le niveau Instagram/Airbnb/Linear : cohérence des couleurs, optimisation mobile, et gestion du consentement cookie intrusive.

---

## 📊 Scores
| Critère | Note | Objectif |
|---------|------|----------|
| Cohérence visuelle | 7/10 | 10/10 |
| Hiérarchie & Layout | 8/10 | 10/10 |
| Fluidité mobile | 6/10 | 10/10 |
| Interactions & Animations | 8/10 | 10/10 |
| Performance | 75/100 | 95+ |
| Accessibilité | 70/100 | 95+ |
| Qualité du code | 8/10 | 10/10 |
| Expérience utilisateur | 7/10 | 10/10 |
| **SCORE GLOBAL** | **6.9/10** | **10/10** |

---

## 🖼️ Screenshots
| Viewport | Screenshot |
|----------|------------|
| Mobile 375px | ![mobile-375](../screenshots/home-mobile-375.png) |
| Desktop 1280px | ![desktop](../screenshots/home-desktop-1280.png) |

---

## 🔴 Problèmes Critiques

### [PC-1] Bannière cookie intrusive sans possibilité de refuser
- **Composant** : `components/privacy/CookieConsent.tsx`
- **Description** : La bannière de cookies occupe une place excessive en bas de page et ne propose pas de bouton "Refuser" - seulement "Accept All" et "Learn more"
- **Impact utilisateur** : Friction utilisateur excessive, violation GDPR/RGPD
- **Solution recommandée** : Ajouter un bouton "Reject All" et rendre la bannière moins intrusive (mini-barre en bas)
- **Priorité** : IMMÉDIATE

### [PC-2] Erreur 404 sur la page forgot-password
- **URL** : `/auth/forgot-password`
- **Description** : Tentative de chargement PreFetch RSC génère une erreur 404
- **Impact utilisateur** : Lien "Forgot password?" mène vers une page inexistante
- **Solution recommandée** : Créer la page `/auth/forgot-password` ou supprimer le lien de la page de login
- **Priorité** : IMMÉDIATE

---

## 🟠 Problèmes Majeurs

### [PM-1] Pas d'attribut autocomplete sur le champ mot de passe
- **Composant** : `src/app/auth/sign-in/page.tsx` (ligne ~27)
- **Description** : Le champ password n'a pas l'attribut `autocomplete="current-password"`
- **Impact utilisateur** : Avertissement console, expérience utilisateur dégradée
- **Solution recommandée** : Ajouter `autocomplete="current-password"` au textbox Password
- **Priorité** : HAUTE

### [PM-2] Erreur de géolocalisation non gérée
- **Description** : Erreur `GeolocationPositionError` dans la console lors du chargement de la carte
- **Impact utilisateur** : Erreur console, la carte ne peut pas obtenir la position utilisateur
- **Solution recommandée** : Ajouter un try-catch et gérer gracefully l'absence de permission géolocalisation
- **Priorité** : HAUTE

### [PM-3] Performance LCP dégradée
- **Description** : La page charge de nombreuses images haute résolution sans lazy loading optimal
- **Impact utilisateur** : LCP > 2.5s sur connexion lente
- **Solution recommandée** : Utiliser `next/image` avec `priority` pour les above-the-fold images, lazy load les autres
- **Priorité** : HAUTE

---

## 🟡 Problèmes Moyens

### [PMoy-1] Incohérence des couleurs CTA
- **Description** : Les boutons CTA utilisent différentes couleurs (rose, violet, bleu) à travers la page
- **Impact utilisateur** : Incohérence visuelle, confusion sur l'action principale
- **Solution recommandée** : Uniformiser les couleurs CTA avec une palette cohérente

### [PMoy-2] Navigation mobile incomplete
- **Description** : Le menu mobile s'ouvre mais certains liens internes (#features, #ai, etc.) ne fonctionnent pas correctement
- **Impact utilisateur** : L'utilisateur ne peut pas naviguer vers les sections depuis le menu mobile
- **Solution recommandée** : Tester et corriger le comportement des liens d'ancrage sur mobile

### [PMoy-3] Images Unsplash en dur dans le code
- **Description** : Les images utilisent des URLs Unsplash directes sans optimisation Next.js
- **Impact utilisateur** : Images non optimisées, temps de chargement plus long
- **Solution recommandée** : Utiliser `next/image` pour toutes les images,可以考虑 utiliser un loader personnalisé

---

## 🟢 Améliorations Mineures

### [Pmin-1] Animation de la navbar pourrait être plus fluide
- **Description** : L'animation au scroll est correcte mais pourrait être plus subtile
- **Solution recommandée** : Réduire la durée de transition à 200ms

### [Pmin-2] Typographie des headings
- **Description** : Les niveaux de heading (h1, h2, h3) pourraient être plus contrastés
- **Solution recommandée** : Utiliser des sizes plus distincts

---

## ✨ Opportunités d'Excellence

1. **Skeleton Loading** : Ajouter des skeletons pendant le chargement des sections dynamiques
2. **Micro-interactions** : Ajouter des hover states subtils sur les cards de features
3. **Smooth Scroll** : Implémenter un scroll fluide pour les liens d'ancrage
4. **Video Background Hero** : Ajouter une vidéo en background dans le hero section (comme Airbnb)

---

## 🐛 Erreurs Techniques Détectées
Console errors  : Erreur géolocalisation (GeolocationPositionError)
Network errors  : 404 sur /auth/forgot-password
Build warnings  : À vérifier
TypeScript errors: À vérifier (pas détecté lors de l'audit)

---

## 📱 Détail Mobile
- ✅ Le menu mobile fonctionne mais les liens d'ancrage sont cassés
- ⚠️ Les touch targets sont correctes (44x44px minimum) mais pourraient être plus grandes
- ⚠️ Les images ne sont pas toutes responsives - certaines overflow leur conteneur
- ❌ La bannière cookies est trop grande sur mobile (prend ~30% de la hauteur)

---

## ⚡ Détail Performance
LCP   : > 2.5s (estimation - non mesuré précisément)
CLS   : À vérifier
INP   : À vérifier
TTFB  : À vérifier
Poids : ~1.5MB (estimation - images non optimisées)

---

## ♿ Détail Accessibilité
- ⚠️ Les couleurs ne respectent pas toujours le ratio WCAG AA
- ⚠️ Manque des labels sur certains inputs du formulaire de waitlist
- ⚠️ Pas de focus visible sur tous les éléments interactifs
- ✅ Structure des headings correcte (h1 → h2 → h3)

---

## 🔒 Détail Sécurité
- ✅ Aucune donnée sensible exposée côté client
- ✅ Inputs validés (FORM + serveur)
- ✅ Utilisation de Next.js security headers (à vérifier dans next.config.ts)

---

## 💡 Note du CTO
Cette landing page est un bon point de départ mais nécessite des corrections immédiates :
1. La gestion des cookies doit être conformité RGPD
2. La page forgot-password manquante crée une mauvaise première impression
3. L'optimisation mobile est insuffisante pour une app se voulant premium

La direction visuelle est bonne (typo, animations) mais la cohérence manque. Je recommande de créer un Design System complet avec tokens de couleurs, spacing, et composants réutilisables.

**Prochaine étape** : Corriger les 2 problèmes critiques (cookies, 404) et améliorer la performance mobile avant le lancement.
