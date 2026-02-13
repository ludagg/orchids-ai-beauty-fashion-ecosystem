# Backend Architecture & Implementation Plan

This document serves as the definitive guide for implementing the backend infrastructure of the Priisme platform. It details the technology stack, database schema, module structure, API design, and testing strategy.

## 1. Technology Stack

- **Framework:** Next.js 15+ (App Router)
- **Database:** PostgreSQL (Production) / SQLite (Local Dev if preferred, but Postgres recommended for parity)
- **ORM:** Drizzle ORM (Type-safe SQL)
- **Authentication:** Better Auth (with Drizzle adapter)
- **Payments:** Stripe
- **Email:** Resend
- **Validation:** Zod
- **Testing:** Vitest + Docker (for integration tests)

---

## 2. Module Structure

The backend is organized into logical modules, each responsible for a specific domain of the application.

### Core Modules:
1.  **Auth & Users:** Authentication, User Profiles, Roles (Admin, Salon Owner, User).
2.  **Salons (Business):** Salon Profiles, Verification, Location, Operating Hours.
3.  **Services:** Service Catalog, Pricing, Duration.
4.  **Bookings:** Appointments, Availability Management, Status Workflow.
5.  **Products (E-commerce):** Inventory, Categories, Collections.
6.  **Orders:** Shopping Cart, Checkout, Payments, Fulfillment.
7.  **Reviews:** Ratings & Feedback for Salons and Products.
8.  **Notifications:** System Alerts, Email Notifications.

---

## 3. Database Schema (PostgreSQL via Drizzle)

The following schema definitions serve as the source of truth for the database structure.

### 3.1 Users & Authentication (Better Auth)

```typescript
// schema/auth.ts
import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'salon_owner', 'admin']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 3.2 Salons & Services

```typescript
// schema/salons.ts
import { pgTable, text, timestamp, boolean, decimal, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const salonStatusEnum = pgEnum('salon_status', ['pending', 'active', 'suspended']);

export const salons = pgTable('salons', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  zipCode: text('zip_code').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  status: salonStatusEnum('status').default('pending').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const services = pgTable('services', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // Stored in cents
  duration: integer('duration').notNull(), // In minutes
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 3.3 Bookings

```typescript
// schema/bookings.ts
import { pgTable, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { salons, services } from './salons';

export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled', 'no_show']);

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  salonId: text('salon_id').notNull().references(() => salons.id),
  serviceId: text('service_id').notNull().references(() => services.id),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: bookingStatusEnum('status').default('pending').notNull(),
  totalPrice: integer('total_price').notNull(), // Snapshot of price at booking time
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 3.4 Products & Orders

```typescript
// schema/commerce.ts
import { pgTable, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { salons } from './salons';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').references(() => salons.id), // Optional: can be platform-owned
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // In cents
  stock: integer('stock').default(0).notNull(),
  images: text('images').array(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']);

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalAmount: integer('total_amount').notNull(), // In cents
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  shippingAddress: text('shipping_address').notNull(), // JSON string or related table
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: integer('price_at_purchase').notNull(), // Snapshot price
});
```

### 3.5 Reviews

```typescript
// schema/reviews.ts
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { salons } from './salons';
import { products } from './commerce';

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  salonId: text('salon_id').references(() => salons.id),
  productId: text('product_id').references(() => products.id),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

## 4. API Route Structure

All API routes will be located in `src/app/api`.

-   **Auth:**
    -   `POST /api/auth/[...better-auth]` - Handles all auth actions (signin, signup, session).
-   **Salons:**
    -   `GET /api/salons` - List salons (with filters: location, services).
    -   `POST /api/salons` - Create a salon profile (Salon Owner).
    -   `GET /api/salons/[id]` - Get salon details.
    -   `PATCH /api/salons/[id]` - Update salon (Owner only).
-   **Services:**
    -   `GET /api/salons/[id]/services` - List services for a salon.
    -   `POST /api/salons/[id]/services` - Add a service (Owner only).
-   **Bookings:**
    -   `GET /api/bookings` - List user's bookings.
    -   `POST /api/bookings` - Create a new booking.
    -   `GET /api/bookings/availability` - Check availability for a service/time.
    -   `PATCH /api/bookings/[id]/status` - Update status (confirm/cancel).
-   **Products:**
    -   `GET /api/products` - List products.
    -   `POST /api/products` - Create product (Admin/Salon Owner).
-   **Orders:**
    -   `POST /api/orders` - Create an order from cart.
    -   `POST /api/webhooks/stripe` - Handle payment events.

---

## 5. Testing Strategy

We will use **Vitest** for running tests and a **Dockerized PostgreSQL** instance for integration testing to ensure we test against a real database environment.

### 5.1 Local Database Setup (Docker)

Create a `docker-compose.yml` in the root:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: priisme_test
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 5.2 Running Integration Tests

1.  **Start DB:** `docker-compose up -d`
2.  **Environment:** Ensure `.env.test` points to this local DB instance:
    ```env
    DATABASE_URL="postgresql://postgres:password@localhost:5432/priisme_test"
    ```
3.  **Run Tests:**
    ```bash
    bun run test
    ```

### 5.3 Test Structure

Tests should be co-located with the module logic or in a dedicated `tests/integration` folder.

Example Test (`tests/integration/auth.test.ts`):
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '@/lib/db';
import { users } from '@/db/schema';

describe('Auth Module', () => {
  it('should create a new user', async () => {
    const newUser = await db.insert(users).values({
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    }).returning();

    expect(newUser[0].email).toBe('test@example.com');
  });
});
```

---

## 6. Implementation Plan (Progressive)

Follow this roadmap to implement the backend incrementally.

### Phase 1: Foundation
1.  **Database Setup:** Configure Drizzle with PostgreSQL.
2.  **Auth Implementation:** Set up Better Auth with the `users` and `sessions` schema.
3.  **Testing Setup:** Configure Docker and Vitest.

### Phase 2: Core Business Logic
4.  **Salons Module:** Implement schema and CRUD APIs for Salons.
5.  **Services Module:** Enable Salons to manage their service catalog.
6.  **Bookings Module:** Implement appointment scheduling and availability logic.

### Phase 3: Commerce & Community
7.  **Products & Orders:** Implement e-commerce schema and Stripe integration.
8.  **Reviews:** Add rating system.
9.  **Notifications:** Integrate Resend for emails.

### Phase 4: Refinement
10. **Security Audit:** Review RLS (Row Level Security) and API protection.
11. **Performance:** Optimize queries and add indexes.
