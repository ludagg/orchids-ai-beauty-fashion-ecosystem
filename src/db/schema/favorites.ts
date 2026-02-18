import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { products } from './commerce';
import { salons } from './salons';
import { videos } from './content';
import { relations } from 'drizzle-orm';

export const favorites = pgTable('favorites', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id, { onDelete: 'cascade' }),
  salonId: text('salon_id').references(() => salons.id, { onDelete: 'cascade' }),
  videoId: text('video_id').references(() => videos.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  userProductIdx: uniqueIndex('user_product_idx').on(t.userId, t.productId),
  userSalonIdx: uniqueIndex('user_salon_idx').on(t.userId, t.salonId),
  userVideoIdx: uniqueIndex('user_video_idx').on(t.userId, t.videoId),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
  salon: one(salons, {
    fields: [favorites.salonId],
    references: [salons.id],
  }),
  video: one(videos, {
    fields: [favorites.videoId],
    references: [videos.id],
  }),
}));
