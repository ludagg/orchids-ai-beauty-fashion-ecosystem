# Rapport Technique Détaillé - Projet Orchids "Priisme"

## Vue d'Ensemble du Projet

**Nom du projet :** Orchids - Priisme  
**Type d'application :** Écosystème IA Beauté & Mode  
**Version actuelle :** V1.5 (En développement avancé)
**Date du rapport :** 19 février 2026  

### Description Fonctionnelle

Priisme est une plateforme révolutionnaire qui fusionne l'expérience sociale de TikTok, l'efficacité d'un SaaS de réservation pour salons, et la puissance d'un marketplace enrichi par l'IA. L'ambition est de créer l'écosystème ultime pour la beauté et la mode, intégrant commerce vidéo immersif, services professionnels, et personnalisation algorithmique.

---

## 1. Architecture Technique Choisie

### 1.1 Stack Technologique Principal

**Frontend & UI (Performance & Interactivité) :**
- **Next.js 15+** avec App Router (architecture moderne, streaming SSR)
- **React 19** (concurrent rendering pour fluidité maximale)
- **TypeScript** (type safety critique pour la complexité métier)
- **Tailwind CSS v4** + `tailwindcss-animate` (design system atomique ultra-léger)
- **Radix UI** (primitives accessibles et non-stylisées pour une liberté totale de design)

**Backend & Base de Données (Robustesse & Scale) :**
- **Drizzle ORM** (ORM type-safe proche du SQL natif pour requêtes complexes)
- **PostgreSQL** (base relationnelle avec extensions spatiales et JSONB)
- **Better Auth** (authentification moderne, multi-tenant et rôles granulaires)

**Paiements & Services Tiers :**
- **Stripe Connect** (paiements splittés marketplace/salons)
- **Resend** (transactional emails designés avec React Email)
- **Cloudflare R2** (stockage objet S3-compatible haute performance)

**Animation & UX Immersive :**
- **Framer Motion** (orchestration complexe d'animations layout et gestuelles)
- **Three.js / React Three Fiber** (éléments 3D interactifs, particules, globe)
- **React Spring** (physique réaliste pour les interactions tactiles)

---

## 2. Structure du Projet & Modules

### 2.1 Organisation des Dossiers (Domain-Driven Design)

```
orchids-ecosystem/
 src/
   ├── app/                    # Next.js App Router (Routes & Layouts)
   │   ├── (auth)/            # Auth Flows (Login, Register, Reset)
   │   ├── app/               # Application Client (User Facing)
   │   ├── admin/             # Back-office Admin Général
   │   ├── business/          # Dashboard Salon & Partenaires (SaaS)
   │   └── api/               # API Routes (REST endpoints)
   ├── components/            # Bibliothèque de composants
   │   ├── ui/                # Système de Design (Boutons, Inputs...)
   │   ├── marketing/         # Sections Landing Page
   │   ├── ai-stylist/        # Chat & Recommandation
   │   ├── social/            # Feed Vidéo & Interactions
   │   └── dashboard/         # Widgets Analytiques & Calendrier
   ├── db/
   │   └── schema/            # Définitions Drizzle (Single Source of Truth)
   ├── lib/                   # Utilitaires, Helpers, Configs
   └── hooks/                 # Logique React réutilisable (Custom Hooks)
 drizzle/                   # Migrations SQL versionnées
 public/                    # Assets statiques optimisés
```

---

## 3. Base de Données - Modèle de Données Unifié

L'architecture de données est conçue pour supporter la complexité d'un marketplace de services ET de produits.

### 3.1 Schémas Principaux

**1. Authentification & Rôles (`auth.ts`)**
- `users`, `sessions`, `accounts` : Standard OAuth + Credentials.
- `profiles` : Données étendues (préférences beauté, types de cheveux).
- `follows` : Graphe social (User suit Salon/Créateur).

**2. Salons & Services (`salons.ts`)**
- `salons` : Entité centrale (Géoloc, Note, Status).
- `services` : Catalogue prestations (Durée, Prix, Staff assigné).
- `staff` : Gestion des employés et de leurs plannings individuels.
- `opening_hours` : Gestion fine des créneaux.

**3. Réservations (`bookings.ts`)**
- `bookings` : La transaction de service (Lien User <-> Salon <-> Staff).
- `availability` : Vue matérialisée ou calculée des créneaux libres.

**4. Commerce (`commerce.ts`)**
- `products` : Catalogue physique (Variantes, Stocks).
- `orders` : Commandes multi-vendeurs.
- `order_items` : Lignes de commande liées aux produits.

**5. Social & Contenu (`social.ts`)**
- `videos` : Contenu UGC (User Generated Content) ou Pro.
- `interactions` : Likes, Comments, Shares, Saves.
- `reviews` : Avis vérifiés avec photos (pour Produits et Salons).

---

## 4. Fonctionnalités Implémentées & Expérience Utilisateur

### 4.1 Page d'Accueil (Landing Page) - "L'Effet Wow"

**Expérience :**
- **Hero Section Cinématique :** Vidéo d'ambiance en arrière-plan avec typographie animée.
- **Scroll Telling :** Les sections apparaissent et s'animent au défilement (Fade-in, Slide-up).
- **Showcase 3D :** Présentation interactive des fonctionnalités clés (Phone mockup rotatif).

### 4.2 Application Principale (`/app/`) - Le Cœur de l'Écosystème

**1. Feed "Social Commerce" (`/app/feed`)**
- **Design :** Plein écran, immersive, inspiré de TikTok/Reels.
- **Interactions :** Double-tap pour liker, swipe up pour passer à la vidéo suivante.
- **Achat Direct :** "Shop the Look" overlay permettant d'acheter les produits tagués dans la vidéo sans quitter le flux.

**2. Marketplace & Recherche (`/app/shop`)**
- **Filtres Intelligents :** Par préoccupation (ex: "Peau sèche", "Cheveux bouclés") plutôt que juste par catégorie.
- **Fiches Produits Riches :** Galeries photos, vidéos de démonstration, avis clients avec photos, et suggestions "Complete the Look".

**3. Réservation Salon (`/app/salons`)**
- **Géolocalisation :** Carte interactive (Leaflet/Mapbox) montrant les salons à proximité avec prix d'appel.
- **Booking Flow Simplifié :** Sélection Service -> Coiffeur -> Créneau -> Paiement/Acompte en moins de 4 clics.

**4. Dashboard Salon / Partenaire (`/business`)**
- **Vue Calendrier :** Interface drag-and-drop fluide pour gérer les RDV.
- **Analytiques :** Graphiques de performance (CA, Taux de retour client).
- **Gestion Client :** Mini-CRM intégré (Historique des prestations, notes techniques).

**5. IA Stylist (`/app/ai-stylist`)**
- **Chatbot Génératif :** Interface conversationnelle naturelle pour demander des conseils ("Quelle routine pour mes cheveux ?").
- **Personnalisation :** Réponses contextuelles basées sur le profil de l'utilisateur et ses achats précédents.

---

## 5. Architecture UI/UX Avancée

L'excellence de l'expérience utilisateur repose sur des choix techniques précis.

### 5.1 Design System "Radix + Tailwind"
L'utilisation de **Radix UI** (primitives "headless") couplée à **Tailwind CSS** permet de créer des composants totalement sur-mesure tout en garantissant une accessibilité (a11y) native (navigation clavier, screen readers). Contrairement aux librairies "toutes faites" (MUI, AntD), cette approche offre une liberté créative totale pour un branding unique.

### 5.2 Micro-interactions & Motion
**Framer Motion** est utilisé pour :
- **Transitions de Page :** Suppression de l'effet de "chargement blanc" entre les routes.
- **Feedback Tactile :** Boutons qui réagissent à la pression, cartes qui se soulèvent au survol.
- **Animation de Liste :** Les éléments (produits, vidéos) entrent en séquence (staggered animation) pour une sensation de fluidité.

### 5.3 Performance Perçue
- **Skeletons Intelligents :** Chargement progressif des éléments (forme grise pulsante) pour réduire la frustration d'attente.
- **Optimistic UI :** Les actions utilisateur (Like, Ajout Panier) sont reflétées instantanément dans l'interface, le serveur est mis à jour en arrière-plan.

---

## 6. Sécurité & Performance

### 6.1 Sécurité
- **Middleware Next.js :** Protection des routes sensibles (Admin, Business).
- **Zod Validation :** Validation stricte des entrées API et formulaires pour prévenir les injections.
- **Content Security Policy (CSP) :** Configuration stricte des headers HTTP.

### 6.2 Performance (Core Web Vitals)
- **Image Optimization :** Utilisation de `next/image` avec formats modernes (AVIF, WebP).
- **Dynamic Imports :** Chargement différé des composants lourds (ex: Cartes, Graphiques) pour un TTI (Time to Interactive) rapide.
- **Database Indexing :** Indexation stratégique des colonnes clés (slugs, user_ids, dates) pour des requêtes < 50ms.

---

## 7. État d'Avancement & Roadmap Technique

### 7.1 Réalisations Clés (Complété)
- ✅ Architecture Next.js 15 & Base de données PostgreSQL en place.
- ✅ Système d'authentification robuste (Multi-rôles).
- ✅ Flux de réservation de base fonctionnel.
- ✅ Marketplace produits avec panier et checkout Stripe.
- ✅ Landing page haute fidélité.

### 7.2 En Cours & Prochaines Étapes
- 🔄 **Refonte Upload Médias :** Migration vers Cloudflare R2 avec redimensionnement à la volée.
- 🔄 **Optimisation Vidéo :** Implémentation du streaming HLS pour le feed social.
- 🔜 **Staff Management :** Gestion fine des plannings employés pour les salons.
- 🔜 **Social Features :** Commentaires temps réel, partages, et notifications push.

---

**Conclusion Technique :**
Priisme est conçu non pas comme un simple site web, mais comme une **application web progressive (PWA)** de niveau natif. La stack technique est "Future-Proof", privilégiant la modularité, la performance brute et l'expérience développeur (DX), garantissant ainsi une vélocité élevée pour les itérations futures.
