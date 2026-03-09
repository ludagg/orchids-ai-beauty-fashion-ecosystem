# Priisme

Priisme is a SaaS application described as a 'TikTok x Beauty Marketplace' ecosystem. It integrates a vertical video feed, salon booking SaaS, and AI stylist features.

## Tech Stack
- **Framework:** Next.js 15.1.0 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Better Auth
- **Storage:** Cloudflare R2 (via AWS S3 client)
- **Styling:** Tailwind CSS, Shadcn (Radix UI), Framer Motion
- **Payments:** Stripe

## Development Setup

1. **Install dependencies:**
   We recommend using `bun` for development.
   ```bash
   bun install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in the necessary values.
   ```bash
   cp .env.example .env
   ```
   Ensure you set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_BASE_URL` for local development.

3. **Database Setup:**
   Generate and push the database schema:
   ```bash
   bun run db:generate
   bun run db:push
   ```

4. **Run the development server:**
   ```bash
   bun dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Testing

Run tests with:
```bash
bun test
```
Tests use `bun:test` under the hood for unit testing components and utilities.

## Build

To build the application for production:
```bash
bun run build
```

## Structure
- `src/app/`: Next.js App Router definitions.
- `src/components/`: Reusable React components.
- `src/db/`: Database schemas, queries, and migrations using Drizzle ORM.
- `src/lib/`: Shared utilities, helpers, and configurations.
- `src/visual-edits/`: Visual editor integration logic.

## Contribution
Check out `AGENTS.md` for architectural guidelines, and always ensure code passes `bun run lint` and `bun test`.
