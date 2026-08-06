# Rapport d'Avancement Technique - Projet Priisme

## 1. Vue d'ensemble du Projet

**Priisme** est une plateforme innovante fusionnant l'engagement social d'un réseau type "TikTok" avec une marketplace beauté et un système de réservation de salons de coiffure. L'objectif est de créer un écosystème complet où l'inspiration vidéo mène directement à l'achat de produits ou à la réservation de services.

## 2. Stack Technique et Architecture

L'application repose sur une architecture moderne, performante et scalable, utilisant les dernières versions des technologies web.

### Frontend & Framework
- **Framework Principal :** Next.js 16 (App Router) avec Turbopack.
- **Langage :** TypeScript (typage strict pour la robustesse).
- **Styling :** Tailwind CSS v4, Shadcn/UI (composants accessibles basés sur Radix UI), Lucide React (icônes).
- **Animations :** Framer Motion, Motion One.
- **Cartographie :** Leaflet / React-Leaflet (OpenStreetMap) pour la géolocalisation des salons.
- **Médias :** Embla Carousel (pour le feed vidéo vertical), React Player.

### Backend & Données
- **Base de Données :** PostgreSQL.
- **ORM (Object-Relational Mapping) :** Drizzle ORM (léger, performant et type-safe).
- **Authentification :** Better-Auth (gestion sécurisée des sessions, OAuth, rôles).
- **Paiements :** Stripe (intégration complète pour marketplace et services).
- **Intelligence Artificielle :** Google Gemini AI (via `@google/generative-ai`) pour le Styliste Personnel.

### Infrastructure & Services Tiers
- **Hébergement Vercel** (optimisé pour Next.js).
- **Stockage Images :** Support pour URLs distantes (Unsplash, etc.) configuré via `next.config.ts`.

## 3. Structure de la Base de Données

L'architecture des données est modulaire, divisée en plusieurs schémas clairs :

1.  **Auth (`src/db/schema/auth.ts`) :**
    -   Gestion des utilisateurs (`users`), sessions, comptes liés.
    -   Système de rôles (`user`, `salon_owner`, `admin`).
    -   Suivi social (`follows`).

2.  **Salons (`src/db/schema/salons.ts`) :**
    -   Profils professionnels complets (adresse, géolocalisation latitude/longitude).
    -   Horaires d'ouverture (`opening_hours`) et gestion des fermetures.
    -   Catalogue de services (`services`) avec prix et durée.
    -   Galerie photos des salons.

3.  **Contenu & Social (`src/db/schema/content.ts`) :**
    -   Vidéos (`videos`) avec statut (publié, brouillon).
    -   Interactions : Likes (`video_likes`), Commentaires (`video_comments`).
    -   **Commerce Vidéo :** Lien direct Produit-Vidéo (`video_products`) permettant le "Shop the look".

4.  **Commerce (`src/db/schema/commerce.ts`) :**
    -   Produits (`products`) avec gestion de stock et variantes.
    -   Commandes (`orders`) et lignes de commande (`order_items`).
    -   Statuts de commande détaillés (pending, paid, shipped, etc.).

5.  **Réservations (`src/db/schema/bookings.ts`) :**
    -   Système de rendez-vous liant Utilisateur, Salon et Service.
    -   Statuts de réservation (confirmé, annulé, complété).

## 4. Fonctionnalités Réalisées

### A. Expérience Utilisateur (Client)

#### 1. Onboarding & Personnalisation
-   Flux d'inscription fluide avec définition des préférences (Style, Intérêts, Budget).
-   Adaptation du contenu en fonction des réponses (ex: étape Morphologie conditionnelle).

#### 2. Feed Vidéo Immersif ("TikTok-style")
-   Interface plein écran avec défilement vertical fluide.
-   Lecture vidéo optimisée.
-   **Interactions :** Like, Commentaire, Partage.
-   **Shopping Intégré :** Bouton "Acheter" sur les vidéos présentant des produits, ouvrant un panel d'achat sans quitter le flux.

#### 3. Marketplace Beauté
-   Catalogue de produits filtrable.
-   Fiches produits détaillées avec variantes (taille, couleur).
-   **Panier d'achat :** Persistant (localStorage) et synchronisé.
-   **Paiement :** Tunnel de commande complet avec Stripe Elements (sécurisé).

#### 4. Recherche et Réservation de Salons
-   **Carte Interactive :** Exploration des salons à proximité.
-   **Fiche Salon :** Informations, photos, liste des services et prix.
-   **Prise de RDV :** Sélection de créneau, confirmation et paiement (acompte ou totalité).

#### 5. AI Stylist
-   Chatbot intelligent intégré (accessible via header/mobile menu).
-   Conseils personnalisés basés sur le profil utilisateur grâce à l'API Gemini.

#### 6. Espace Communautaire
-   Profils Créateurs/Utilisateurs.
-   Système de fidélité (Loyalty Points) visualisable sur le profil.
-   Messagerie et Notifications (système temps réel pour les RDV et interactions).

### B. Espace Professionnel (Salon Dashboard)

Un tableau de bord dédié (`/business`) pour les partenaires :
-   **Vue d'ensemble :** Statistiques clés (revenus, RDV).
-   **Gestion des Rendez-vous :** Calendrier, statuts des réservations.
-   **Gestion de l'Établissement :** Modification des horaires, infos, services proposés.
-   **Authentification séparée :** Flux de connexion/inscription spécifique aux pros.

### C. Administration (Back-Office)

Interface d'administration pour la modération et la gestion globale :
-   Gestion des Utilisateurs (suspension, rôles).
-   Validation des Salons partenaires.
-   Suivi global des commandes Marketplace.

## 5. Sécurité et Performance

-   **Middleware :** Protection des routes sensibles (`/business`, `/admin`) et redirection automatique si non authentifié.
-   **Server Actions :** Logique métier exécutée côté serveur pour plus de sécurité et moins de JavaScript côté client.
-   **Validation des Données :** Utilisation de Zod pour valider toutes les entrées (formulaires, API).

## 6. Conclusion

La structure technique est en place et robuste. Les fonctionnalités critiques (Auth, Paiement, Vidéo, Réservation) sont opérationnelles. L'architecture modulaire permet d'envisager sereinement les prochaines évolutions (V2) telles que l'upload vidéo avancé ou l'intégration de calendriers externes.
