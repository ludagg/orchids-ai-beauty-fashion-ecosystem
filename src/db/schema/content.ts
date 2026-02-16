import { pgTable, text, timestamp, integer, boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { salons } from './salons';
import { relations } from 'drizzle-orm';

export const videos = pgTable('videos', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  salonId: text('salon_id').references(() => salons.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: text('category'), // e.g. "Fashion", "Beauty"
  views: integer('views').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  isLive: boolean('is_live').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const videoLikes = pgTable('video_likes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  videoId: text('video_id').notNull().references(() => videos.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  userVideoIdx: uniqueIndex('user_video_like_idx').on(t.userId, t.videoId),
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
