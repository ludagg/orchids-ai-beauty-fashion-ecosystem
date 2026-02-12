# Fonctionnalités Manquantes et Dette Technique

Ce document recense les éléments manquants pour transformer ce prototype frontend en une application fonctionnelle.

## 🔴 Backend & Infrastructure (Critique)

- **API Routes (`src/app/api`) :** Aucune route API n'est implémentée. Le frontend n'a aucun moyen de communiquer avec un serveur.
- **Base de Données :**
  - Aucune configuration de base de données (ex: `drizzle.config.ts`, `schema.ts` manquants).
  - Aucune migration.
  - Pas de connexion à une base de données réelle (PostgreSQL/Neon prévu mais non configuré).
- **Authentification :**
  - La page `src/app/auth/page.tsx` est purement visuelle.
  - La logique d'inscription/connexion (via `better-auth` ou autre) est inexistante.
  - Pas de gestion de session, de protection des routes ou de rôles (Admin vs User vs Salon).

## 🟠 Logique Métier

- **Système de Réservation :**
  - L'interface de réservation existe, mais elle ne crée aucune donnée.
  - Pas de vérification de disponibilité (créneaux horaires).
  - Pas de gestion des calendriers pour les salons.
- **Paiements (Stripe) :**
  - Dépendance `stripe` présente dans `package.json`, mais aucune intégration.
  - Pas de création d'intentions de paiement (PaymentIntents).
  - Pas de webhooks pour confirmer les transactions.
- **Marketplace & Produits :**
  - Les produits affichés sont statiques ou mockés.
  - Pas de panier persistant (sauf peut-être en local storage, à vérifier).
  - Pas de flux de commande (Checkout).
- **Recherche :**
  - La barre de recherche (`SearchBar`) redirige vers une page, mais la logique de filtrage (par localisation, prix, catégorie) est manquante côté serveur.

## 🟡 Fonctionnalités Sociales & Contenu

- **Vidéos / Live Commerce :**
  - Les vidéos sont probablement des placeholders ou des fichiers statiques.
  - Pas de upload de vidéo pour les créateurs.
  - Pas de streaming en direct réel.
- **Profils Utilisateurs :**
  - Impossible de mettre à jour son profil (avatar, bio, préférences).
  - Pas de lien entre les créateurs et leurs vidéos.

## 🔧 Dette Technique & Qualité

- **TypeScript :**
  - La configuration `next.config.ts` contient `ignoreBuildErrors: true`, ce qui signifie que le typage est potentiellement cassé ou incomplet.
- **Tests :**
  - Aucun test unitaire ou d'intégration visible (fichiers `*.test.tsx` ou `*.spec.tsx` absents ou non exécutés).
- **Environnement :**
  - Pas de fichier `.env.example` pour guider la configuration des clés API (Stripe, DB, Auth).
- **Accessibilité & SEO :**
  - À auditer (manque probable de balises ARIA sur les composants interactifs complexes).

## 📋 Prochaines Étapes Recommandées

1.  **Initialiser la Base de Données :** Configurer Drizzle ORM et Neon PostgreSQL.
2.  **Mettre en place l'Authentification :** Implémenter `better-auth` pour gérer les utilisateurs.
3.  **Créer les API Routes :** Commencer par les routes CRUD de base (Users, Salons).
4.  **Connecter le Frontend :** Remplacer les données mockées par des appels API (via `fetch` ou `React Query`).
