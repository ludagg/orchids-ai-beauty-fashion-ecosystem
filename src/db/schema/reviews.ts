import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { salons } from './salons';
import { shops } from './shops';
import { users } from './auth';
import { products } from './commerce';

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').references(() => salons.id, { onDelete: 'cascade' }),
  shopId: text('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  salon: one(salons, {
    fields: [reviews.salonId],
    references: [salons.id],
  }),
  shop: one(shops, {
    fields: [reviews.shopId],
    references: [shops.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));
