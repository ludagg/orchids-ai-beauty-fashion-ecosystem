import { pgTable, text, timestamp, integer, boolean, pgEnum, real } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { salons } from './salons';
import { relations } from 'drizzle-orm';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').references(() => salons.id), // Optional: can be platform-owned
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // In cents
  stock: integer('stock').default(0).notNull(),
  images: text('images').array(), // Postgres array of strings
  isActive: boolean('is_active').default(true).notNull(),
  category: text('category'), // e.g. "Apparel", "Beauty"
  brand: text('brand'),
  rating: real('rating').default(0),
  reviewCount: integer('review_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderStatusEnum = pgEnum('order_status', ['pending', 'reserved', 'paid', 'processing', 'ready_for_pickup', 'shipped', 'delivered', 'cancelled', 'completed']);

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalAmount: integer('total_amount').notNull(), // In cents
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  shippingAddress: text('shipping_address'), // Optional now for pickup
  pickupDate: timestamp('pickup_date'),
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

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  salon: one(salons, {
    fields: [products.salonId],
    references: [salons.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
