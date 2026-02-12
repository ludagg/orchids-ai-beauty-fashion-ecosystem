# Priisme - Frontend Prototype

Priisme est une application Next.js conçue pour être une plateforme complète de gestion de salons de beauté et de commerce en direct ("Live Commerce"). Ce dépôt contient actuellement la structure frontend et l'interface utilisateur.

⚠️ **Note Importante :** Ce projet est actuellement un prototype frontend. La logique backend (base de données, authentification réelle, paiements) n'est pas implémentée, bien que des dépendances soient présentes.

## 🚀 Technologies Utilisées

- **Framework :** [Next.js 15+](https://nextjs.org/) (App Router)
- **Langage :** TypeScript
- **Style :** [Tailwind CSS v4](https://tailwindcss.com/)
- **Composants UI :** [Shadcn/UI](https://ui.shadcn.com/) (basé sur Radix UI)
- **Animations :** [Framer Motion](https://www.framer.com/motion/)
- **Icônes :** [Lucide React](https://lucide.dev/)
- **Graphiques :** [Recharts](https://recharts.org/)
- **Gestionnaire de paquets :** [Bun](https://bun.sh/)

## 🛠️ Installation et Démarrage

Assurez-vous d'avoir [Bun](https://bun.sh/) installé sur votre machine.

1.  **Installer les dépendances :**
    ```bash
    bun install
    ```

2.  **Lancer le serveur de développement :**
    ```bash
    bun dev
    ```

3.  Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📂 Structure du Projet

L'application suit l'architecture App Router de Next.js :

- `src/app/auth` : Pages d'authentification (Login/Register - UI seulement).
- `src/app/app` : Espace utilisateur principal (Recherche, Profil, Réservations).
- `src/app/admin` : Tableau de bord Super Admin.
- `src/app/salon-dashboard` : Tableau de bord pour les propriétaires de salons.
- `src/app/videos-creations` : Interface de "Live Commerce" (style TikTok/Reels).
- `src/components/ui` : Composants réutilisables (Boutons, Cards, Inputs...).

## 📝 Fonctionnalités (État Actuel)

- **Interface Utilisateur Riche :** Design moderne et réactif.
- **Tableaux de Bord :** Vues distinctes pour les Clients, les Salons et les Admins.
- **Système de Thème :** Support Dark/Light mode.
- **Visualisation de Données :** Graphiques intégrés pour les statistiques.

## 🔗 Références Backend

Voir le fichier `BACKEND_REFERENCE.md` pour la documentation technique sur l'architecture backend prévue (Authentification, Stripe, Emails, IA).

