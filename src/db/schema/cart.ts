import { pgTable, text, timestamp, integer, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { products } from './commerce';
import { relations } from 'drizzle-orm';

export const cartStatusEnum = pgEnum('cart_status', ['active', 'abandoned', 'converted']);

export const carts = pgTable('carts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: cartStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const cartItems = pgTable('cart_items', {
  id: text('id').primaryKey(),
  cartId: text('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  variantId: text('variant_id'), // Optional, if product has variants
  selectedOptions: jsonb('selected_options'), // e.g. { color: "Red", size: "M" }
  quantity: integer('quantity').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));
