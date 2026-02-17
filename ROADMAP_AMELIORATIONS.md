# Roadmap, Améliorations & Vision V2

Ce document recense de manière exhaustive les fonctionnalités manquantes, les améliorations techniques nécessaires, et les opportunités pour une version 2 (V2) de l'application "Priisme" (TikTok x Beauty Marketplace).

## 1. Infrastructure & DevOps (Priorité Haute)

L'application actuelle repose sur des bases solides (Next.js, Drizzle, Stripe), mais manque d'infrastructure pour passer à l'échelle en production.

*   **Stockage de Fichiers (S3 / R2) :**
    *   *Actuel :* Les URLs des images/vidéos sont souvent entrées manuellement ou stockées en Base64 (ce qui alourdit la BDD).
    *   *Manquant :* Intégration d'un bucket S3 (AWS) ou Cloudflare R2 pour l'upload réel de fichiers (Drag & Drop).
    *   *Amélioration :* Redimensionnement automatique des images à l'upload (Next.js Image Optimization ne suffit pas pour l'upload source).

*   **Traitement Vidéo (Transcodage) :**
    *   *Actuel :* Lecture directe du fichier source.
    *   *Manquant :* Pipeline de transcodage (FFmpeg, Mux, ou AWS MediaConvert) pour générer des flux adaptatifs (HLS/DASH) afin que les vidéos chargent vite sur mobile (4G/5G).
    *   *Amélioration :* Génération automatique de miniatures animées (GIF/WebP) au survol.

*   **Monitoring & Logs :**
    *   *Actuel :* `console.log`.
    *   *Manquant :* Intégration de Sentry ou LogRocket pour le suivi des erreurs client/serveur en temps réel.
    *   *Amélioration :* Analytics produit (PostHog ou Mixpanel) pour comprendre le comportement utilisateur (rétention, entonnoir d'achat).

*   **Cache & Performance :**
    *   *Actuel :* Cache Next.js standard.
    *   *Manquant :* Redis (via Upstash ou self-hosted) pour mettre en cache les requêtes lourdes (feed vidéo, disponibilité créneaux).
    *   *Amélioration :* CDN global pour les assets statiques.

## 2. Fonctionnalités SaaS Salon & Booking (Le "Toast" de la Beauté)

Le système de réservation actuel est fonctionnel mais basique pour un usage professionnel intensif.

*   **Gestion du Staff (Crucial) :**
    *   *Actuel :* Réservation liée au Salon uniquement.
    *   *Manquant :* Table `Staff` liée aux Salons. Les clients réservent "Une coupe avec Julie". Gestion des horaires individuels par employé.
    *   *Amélioration :* Rôles et permissions granulaires pour les employés (accès limité au calendrier, pas aux finances).

*   **Synchronisation Calendrier :**
    *   *Actuel :* Calendrier interne uniquement.
    *   *Manquant :* Sync bidirectionnelle avec Google Calendar / Apple Calendar / Outlook (via API Cronofy ou nylas) pour éviter les double-bookings.

*   **Politique d'Annulation & Acomptes :**
    *   *Actuel :* Paiement total ou rien.
    *   *Manquant :* Configuration des acomptes (ex: 30% à la résa). Règles d'annulation (ex: gratuit jusqu'à 24h, sinon frais).
    *   *Amélioration :* "No-show protection" (empreinte bancaire sans débit immédiat).

*   **CRM & Marketing :**
    *   *Actuel :* Liste de bookings.
    *   *Manquant :* Base de données clients unifiée par salon. Historique des services par client ("Quelle couleur a fait Mme Michu la dernière fois ?").
    *   *Amélioration :* Campagnes SMS/Email automatiques (Rappel de RDV, "Bon anniversaire", "Revenez nous voir").

## 3. Marketplace & E-commerce (V1.5)

L'expérience d'achat est présente mais doit gérer la complexité du "Multi-vendeur".

*   **Paiements Multi-Vendeurs (Split Payments) :**
    *   *Actuel :* Stripe standard.
    *   *Manquant :* Stripe Connect (Express ou Custom). Lorsqu'un client achète un produit + un service, le paiement doit être splitté automatiquement entre la plateforme (commission) et le salon/vendeur.
    *   *Amélioration :* Gestion des KYB (Know Your Business) pour l'onboarding des salons vendeurs.

*   **Logistique & Expédition :**
    *   *Actuel :* Adresse texte simple.
    *   *Manquant :* Calcul des frais de port réels (intégration ShipStation / SendCloud / La Poste). Génération d'étiquettes d'expédition.
    *   *Amélioration :* Suivi de colis en temps réel dans l'app.

*   **Gestion des Stocks Avancée :**
    *   *Actuel :* Compteur simple.
    *   *Manquant :* Alertes de stock bas. Gestion des variantes complexes (Couleur x Taille x Contenant).
    *   *Amélioration :* Gestion des retours et remboursements partiels directement depuis le dashboard admin.

## 4. Social & Contenu (L'aspect "TikTok")

C'est le cœur de l'attraction utilisateur. Il manque des fonctionnalités d'engagement.

*   **Algorithme de Recommandation :**
    *   *Actuel :* Tri par date ou popularité simple.
    *   *Manquant :* "For You Page" personnalisée basée sur le graphe d'intérêt (temps passé, likes, catégories consultées). Vector Search (pgvector) pour la similarité sémantique.
    *   *Amélioration :* A/B testing des thumbnails.

*   **Live Streaming (Vrai Live) :**
    *   *Actuel :* Indicateur `isLive`.
    *   *Manquant :* Intégration WebRTC ou RTMP (via Mux, Agora ou AWS IVS) pour le streaming vidéo en temps réel avec chat interactif.
    *   *Amélioration :* "Live Shopping" : Épingler des produits cliquables pendant le live.

*   **Outils de Création In-App :**
    *   *Actuel :* Upload de fichier fini.
    *   *Manquant :* Éditeur vidéo basique dans le navigateur (trim, crop, ajouter musique).
    *   *Amélioration :* Filtres AR (Réalité Augmentée) pour le maquillage virtuel ou fun (via DeepAR ou Banuba).

*   **Interactions Sociales :**
    *   *Actuel :* Like, Commentaire.
    *   *Manquant :* Partage externe (Deep links). Stories (contenu éphémère 24h). Duets / Remix (répondre en vidéo).
    *   *Amélioration :* Messagerie privée avec partage de produits/services (actuellement basique).

## 5. Intelligence Artificielle (V2 Vision)

L'utilisation actuelle de Gemini est un bon début (Styliste), mais peut aller plus loin.

*   **Virtual Try-On (VTO) :**
    *   *Idée :* Utiliser l'IA générative ou la CV (Computer Vision) pour permettre aux utilisateurs de tester virtuellement une couleur de cheveux ou un rouge à lèvres sur leur selfie.

*   **Diagnostic de Peau/Cheveux :**
    *   *Idée :* Analyse d'une photo de l'utilisateur par IA pour recommander automatiquement une routine de produits (Cross-sell puissant).

*   **Assistant Booking Vocal :**
    *   *Idée :* "Réserve-moi une coupe chez le coiffeur le plus proche vendredi soir".

## 6. Mobile & Expérience Utilisateur (UX)

*   **PWA & Natif :**
    *   *Actuel :* Web responsive.
    *   *Manquant :* Manifest PWA complet (installable sur l'écran d'accueil). Notifications Push natives (via Firebase ou WebPush).
    *   *Amélioration :* Wrapper Capacitor/React Native pour publication sur App Store / Play Store.

*   **Accessibilité (a11y) :**
    *   *Manquant :* Audit complet WCAG (navigation clavier, lecteurs d'écran). Mode "Haut Contraste".

*   **Internationalisation (i18n) :**
    *   *Manquant :* Support multi-langues et multi-devises (€, $, £).

## Résumé des Priorités Techniques

1.  **Refactor Upload :** Passer sur S3/R2 immédiatement.
2.  **Stripe Connect :** Indispensable pour payer les salons.
3.  **Staff Management :** Indispensable pour que les salons utilisent l'outil au quotidien.
4.  **Notifications Push :** Pour la rétention utilisateur.
