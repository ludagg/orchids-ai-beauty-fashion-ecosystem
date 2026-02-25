# Priisme (Orchids Ecosystem)

**The Ultimate Beauty & Fashion Ecosystem** combining the virality of TikTok, the utility of a Salon SaaS, and the personalization of AI.

![Priisme Banner](https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?q=80&w=2000&auto=format&fit=crop)

## 🌟 Overview

Priisme is a next-generation platform designed to revolutionize the beauty industry in India and beyond. It is not just a marketplace; it is an **experience-driven ecosystem** where content drives commerce.

*   **For Users:** A personalized feed of beauty videos, one-tap booking for top salons, and an AI stylist that knows your preferences.
*   **For Salons:** A powerful, mobile-first SaaS to manage bookings, staff, and payments, replacing pen-and-paper or outdated software.
*   **For Creators:** A platform to monetize content directly through "Shop the Look" features.

---

## 🚀 Key Features & UX Vision

### 📱 Social Commerce ("TikTok for Beauty")
*   **Immersive Video Feed:** Full-screen, vertical video scrolling with instant playback.
*   **Shop the Look:** Products tagged in videos can be purchased without leaving the stream.
*   **Live Shopping:** Real-time interactive streams with creators, featuring instant purchase pop-ups.

### 💇‍♀️ Salon SaaS & Booking
*   **Smart Scheduling:** Drag-and-drop calendar management for salon owners.
*   **Staff Management:** Individual schedules, commission tracking, and performance analytics.
*   **Automated Marketing:** SMS reminders, "Time to rebook" notifications, and loyalty rewards.

### 🤖 AI Stylist & Personalization
*   **Virtual Try-On (AR):** Test hair colors and makeup shades in real-time using the camera.
*   **Conversational Assistant:** Chat with an AI that understands your skin type, hair texture, and style preferences to recommend products.
*   **Smart Search:** Search by concern (e.g., "frizzy hair in humidity") rather than just keywords.

### 💎 Gamification & Loyalty
*   **Earn & Burn:** Points for every booking, review, and video watch.
*   **Badges:** Unlock status levels (Gold, Platinum) for exclusive perks.
*   **Community Challenges:** Participate in hashtag challenges to win products.

---

## 🛠 Tech Stack

Built with the latest and greatest web technologies for performance and scale.

*   **Frontend:** [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Framer Motion](https://www.framer.com/motion/)
*   **Backend:** [Better Auth](https://better-auth.com/), [Drizzle ORM](https://orm.drizzle.team/), [PostgreSQL](https://www.postgresql.org/)
*   **Infrastructure:** [Vercel](https://vercel.com/), [Cloudflare R2](https://www.cloudflare.com/products/r2/), [Stripe Connect](https://stripe.com/connect)
*   **AI:** [Google Gemini](https://deepmind.google/technologies/gemini/), [Vercel AI SDK](https://sdk.vercel.ai/docs)

---

## 🏁 Getting Started

### Prerequisites
*   Node.js 18+ (LTS recommended)
*   PostgreSQL database (Local or Neon/Supabase)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/priisme.git
    cd priisme
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Environment Setup:**
    Copy `.env.example` to `.env` and fill in your API keys (Database, Auth, Stripe, etc.).

4.  **Database Migration:**
    ```bash
    npm run db:push
    ```

5.  **Run Development Server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

*   `src/app`: Next.js App Router pages and layouts.
*   `src/components`: Reusable UI components (shadcn/ui based).
*   `src/db/schema`: Database schema definitions (Drizzle).
*   `src/lib`: Utility functions and third-party configurations.
*   `public`: Static assets (images, fonts).

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
