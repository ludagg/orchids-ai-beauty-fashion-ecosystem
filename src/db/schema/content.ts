import { pgTable, text, timestamp, integer, boolean, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { salons } from './salons';
import { products } from './commerce';
import { relations } from 'drizzle-orm';

export const videoStatusEnum = pgEnum('video_status', ['published', 'draft', 'private']);

export const videos = pgTable('videos', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  salonId: text('salon_id').references(() => salons.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: text('category'), // e.g. "Fashion", "Beauty"
  status: videoStatusEnum('status').default('published').notNull(),
  views: integer('views').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  isLive: boolean('is_live').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const videoComments = pgTable('video_comments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  videoId: text('video_id').notNull().references(() => videos.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const videoLikes = pgTable('video_likes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  videoId: text('video_id').notNull().references(() => videos.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  userVideoIdx: uniqueIndex('user_video_like_idx').on(t.userId, t.videoId),
}));

export const videoProducts = pgTable('video_products', {
  id: text('id').primaryKey(),
  videoId: text('video_id').notNull().references(() => videos.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  videoProductIdx: uniqueIndex('video_product_idx').on(t.videoId, t.productId),
}));

export const videosRelations = relations(videos, ({ one, many }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  salon: one(salons, {
    fields: [videos.salonId],
    references: [salons.id],
  }),
  likes: many(videoLikes),
  comments: many(videoComments),
  products: many(videoProducts),
}));

export const videoCommentsRelations = relations(videoComments, ({ one }) => ({
  user: one(users, {
    fields: [videoComments.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [videoComments.videoId],
    references: [videos.id],
  }),
}));

export const videoLikesRelations = relations(videoLikes, ({ one }) => ({
  user: one(users, {
    fields: [videoLikes.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [videoLikes.videoId],
    references: [videos.id],
  }),
}));

export const videoProductsRelations = relations(videoProducts, ({ one }) => ({
  video: one(videos, {
    fields: [videoProducts.videoId],
    references: [videos.id],
  }),
  product: one(products, {
    fields: [videoProducts.productId],
    references: [products.id],
  }),
}));
