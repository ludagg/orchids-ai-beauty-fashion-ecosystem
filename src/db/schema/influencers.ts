import { pgTable, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { relations } from 'drizzle-orm';
import { salons } from './salons';

export const influencerProfiles = pgTable('influencer_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  niche: text('niche').array(),
  followerCount: integer('follower_count').default(0),
  engagementRate: integer('engagement_rate').default(0), // Can be stored as integer e.g., 55 for 5.5%
  mediaKitUrl: text('media_kit_url'),
  isVerified: boolean('is_verified').default(false),
  metrics: jsonb('metrics').$type<{
    instagramFollowers?: number;
    tiktokFollowers?: number;
    youtubeSubscribers?: number;
    averageViews?: number;
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const brandDeals = pgTable('brand_deals', {
  id: text('id').primaryKey(),
  influencerId: text('influencer_id').notNull().references(() => influencerProfiles.id, { onDelete: 'cascade' }),
  salonId: text('salon_id').references(() => salons.id, { onDelete: 'set null' }), // Can be null if it's a platform-wide deal
  title: text('title').notNull(),
  description: text('description').notNull(),
  requirements: text('requirements'),
  rewardAmount: integer('reward_amount'), // In cents or points
  status: text('status').default('open').notNull(), // open, accepted, completed, cancelled
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const influencerProfilesRelations = relations(influencerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [influencerProfiles.userId],
    references: [users.id],
  }),
  brandDeals: many(brandDeals),
}));

export const brandDealsRelations = relations(brandDeals, ({ one }) => ({
  influencer: one(influencerProfiles, {
    fields: [brandDeals.influencerId],
    references: [influencerProfiles.id],
  }),
  salon: one(salons, {
    fields: [brandDeals.salonId],
    references: [salons.id],
  }),
}));
