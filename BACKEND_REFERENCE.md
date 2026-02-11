# Backend Reference Guide

## Overview

This document serves as a comprehensive guide for implementing the backend infrastructure for the Priisme platform. It covers the tech stack, database schema, API structure, authentication, and implementation guidelines.

## Tech Stack

### Core Dependencies
- **better-auth**: Authentication and session management
- **@auth/core**: Alternative authentication solution (if needed)
- **drizzle-orm**: Type-safe SQL ORM
- **drizzle-kit**: Drizzle toolkit for migrations
- **stripe**: Payment processing
- **resend**: Email delivery service

### Additional Libraries
- **next-auth**: Next.js authentication (alternative)
- **@prisma/client**: Prisma ORM (alternative to Drizzle)
- **prisma**: Prisma CLI
- **zod**: Schema validation
- **react-hook-form**: Form management
- **@hookform/resolvers**: Form validation resolvers

## Database Schema

### Core Authentication Tables

#### `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  name TEXT,
  image TEXT,
  password_hash TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'admin', 'salon_owner'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `sessions`
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `accounts`
```sql
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'google', 'github', 'email'
  provider_account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);
```

#### `verification_tokens`
```sql
CREATE TABLE verification_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'email_verification', 'password_reset'
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Platform Tables

#### `products`
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  images TEXT[], -- Array of image URLs
  category TEXT NOT NULL,
  tags TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `salons`
```sql
CREATE TABLE salons (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  website TEXT,
  images TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `services` (Salon Services)
```sql
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  salon_id TEXT NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `appointments`
```sql
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  salon_id TEXT NOT NULL REFERENCES salons(id),
  service_id TEXT REFERENCES services(id),
  appointment_date TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `reviews`
```sql
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  salon_id TEXT REFERENCES salons(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images TEXT[],
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CHECK (product_id IS NOT NULL OR salon_id IS NOT NULL)
);
```

#### `orders`
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `order_items`
```sql
CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `wishlists`
```sql
CREATE TABLE wishlists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

## API Route Structure

### Authentication Routes (`/api/auth/[...better-auth]`)
- `POST /api/auth/sign-up` - Email/password signup
- `POST /api/auth/sign-in` - Email/password signin
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### OAuth Routes
- `GET /api/auth/oauth/google` - Google OAuth callback
- `GET /api/auth/oauth/github` - GitHub OAuth callback

### Product Routes
- `GET /api/products` - List products with filters
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/[id]` - Update product (owner only)
- `DELETE /api/products/[id]` - Delete product (owner only)

### Salon Routes
- `GET /api/salons` - List salons with filters
- `GET /api/salons/[id]` - Get salon details
- `GET /api/salons/[id]/services` - Get salon services
- `POST /api/salons` - Create salon (authenticated users)
- `PUT /api/salons/[id]` - Update salon (owner only)

### Appointment Routes
- `GET /api/appointments` - List user appointments
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Cancel appointment

### Review Routes
- `GET /api/reviews` - List reviews with filters
- `GET /api/reviews/[id]` - Get review details
- `POST /api/reviews` - Create review
- `PUT /api/reviews/[id]` - Update review (owner only)
- `DELETE /api/reviews/[id]` - Delete review (owner only)

### Order Routes
- `GET /api/orders` - List user orders
- `GET /api/orders/[id]` - Get order details
- `POST /api/orders` - Create order (with Stripe)

### Wishlist Routes
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/[id]` - Remove from wishlist

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Resend (Email)
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Drizzle ORM Setup

### Installation
```bash
npm install drizzle-orm drizzle-kit postgres
npm install -D @types/pg
```

### Configuration (`drizzle.config.ts`)
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### Creating Schema (`src/db/schema.ts`)
```typescript
import { pgTable, text, timestamp, boolean, decimal, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum for user roles
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'salon_owner']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  name: text('name'),
  image: text('image'),
  passwordHash: text('password_hash'),
  role: userRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Continue with other tables...
```

### Running Migrations
```bash
# Generate migration
npx drizzle-kit generate

# Apply migration
npx drizzle-kit migrate

# Push schema changes (for development)
npx drizzle-kit push
```

## Better Auth Setup

### Configuration (`src/lib/auth.ts`)
```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      enabled: true,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      enabled: true,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  advanced: {
    cookiePrefix: "priisme",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});
```

### API Route (`src/app/api/auth/[...nextauth]/route.ts`)
```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

## Email Templates

### Email Verification
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to Priisme!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}
```

### Password Reset
```typescript
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
}
```

## Stripe Integration

### Creating Payment Intent
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPaymentIntent(amount: number, currency: string = 'inr') {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to paise
    currency,
    metadata: {
      orderId: 'order_id_here',
    },
  });

  return paymentIntent;
}
```

### Webhook Handler (`src/app/api/webhooks/stripe/route.ts`)
```typescript
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update order status to 'paid'
      break;
    case 'payment_intent.payment_failed':
      // Update order status to 'failed'
      break;
  }

  return NextResponse.json({ received: true });
}
```

## AI Stylist Integration Notes

### OpenAI API Integration
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getStyleRecommendations(userPreferences: any) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a fashion stylist AI assistant...",
      },
      {
        role: "user",
        content: JSON.stringify(userPreferences),
      },
    ],
  });

  return completion.choices[0].message.content;
}
```

### User Preferences Schema
```typescript
interface UserPreferences {
  style: string[]; // ['casual', 'formal', 'streetwear']
  colors: string[]; // ['#FF5733', '#33FF57']
  bodyType: string; // 'hourglass', 'athletic', etc.
  occasions: string[]; // ['work', 'party', 'casual']
  budget: {
    min: number;
    max: number;
  };
}
```

## Security Considerations

1. **Input Validation**: Use Zod schemas for all API inputs
2. **Rate Limiting**: Implement rate limiting for sensitive endpoints
3. **CORS**: Configure proper CORS settings
4. **SQL Injection**: Use parameterized queries (Drizzle handles this)
5. **XSS Prevention**: Sanitize user-generated content
6. **CSRF Protection**: Use CSRF tokens for state-changing operations
7. **Session Security**: Use HTTP-only, secure cookies

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Deployment Checklist

- [ ] Set up production database (Neon, Supabase, etc.)
- [ ] Configure environment variables
- [ ] Set up Redis for session storage (if needed)
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and logging
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up backup strategy
- [ ] Configure SSL certificates
- [ ] Set up CI/CD pipeline

## Next Steps

1. **Set up database**: Create a PostgreSQL database (Neon, Supabase, Railway)
2. **Run migrations**: Apply database schema using Drizzle
3. **Configure authentication**: Set up Better Auth with OAuth providers
4. **Implement API routes**: Create route handlers for core features
5. **Set up Stripe**: Create account and configure webhooks
6. **Configure Resend**: Set up email service for verification
7. **Implement frontend integration**: Connect frontend to backend APIs
8. **Add tests**: Write unit and integration tests
9. **Deploy**: Deploy to production environment

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Resend Email API](https://resend.com/docs)
