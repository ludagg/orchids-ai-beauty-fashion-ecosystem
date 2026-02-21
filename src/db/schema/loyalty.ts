import { pgTable, text, integer, boolean, timestamp, decimal, jsonb } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { salons } from './salons';
import { relations } from 'drizzle-orm';

// Niveaux utilisateurs (Bronze → Diamant)
export const userLevels = pgTable('user_levels', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // "Gold", "Platinum"
  minPoints: integer('min_points').notNull(),
  multiplier: decimal('multiplier', { precision: 3, scale: 2 }).default('1.0'),
  // Multiplicateur points (Gold x1.5, Platine x2)
  benefits: text('benefits').array(), // ["Priority booking", "Free cancellations"]
  badgeImage: text('badge_image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Transactions de points (audit trail)
export const pointTransactions = pgTable('point_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(), // +100 ou -500
  type: text('type').notNull(), // "earned_booking", "earned_review", "spent_reward", "bonus_level_up"
  description: text('description').notNull(),
  referenceId: text('reference_id'), // ID booking ou reward
  expiresAt: timestamp('expires_at'), // Certains points expirent
  createdAt: timestamp('created_at').defaultNow(),
});

// Récompenses disponibles
export const rewards = pgTable('rewards', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').references(() => salons.id, { onDelete: 'cascade' }), // NULL = récompense plateforme
  name: text('name').notNull(),
  description: text('description'),
  cost: integer('cost').notNull(), // En points
  type: text('type').notNull(), // "discount_fixed", "discount_percent", "free_service", "product"
  value: integer('value'), // 20% ou ₹500 selon type (stored as int for simplicity, could be decimal)
  image: text('image'),
  quantity: integer('quantity'), // NULL = illimité
  isActive: boolean('is_active').default(true),
  validUntil: timestamp('valid_until'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Récompenses échangées par users
export const userRewards = pgTable('user_rewards', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rewardId: text('reward_id').notNull().references(() => rewards.id, { onDelete: 'cascade' }),
  status: text('status').default('active'), // active, used, expired
  redeemedAt: timestamp('redeemed_at').defaultNow(),
  usedAt: timestamp('used_at'),
  code: text('code').notNull().unique(), // Code à usage unique
});

// Système de badges/achievements
export const badges = pgTable('badges', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // "First Booking", "Review Master"
  description: text('description'),
  category: text('category').notNull(), // "booking", "social", "explorer"
  icon: text('icon').notNull(), // Lucide icon name ou URL
  condition: text('condition').notNull(), // JSON: {"type": "booking_count", "min": 5} - stored as text or jsonb
  pointsBonus: integer('points_bonus').default(0), // Points bonus au déblocage
  rarity: text('rarity').default('common'), // common, rare, epic, legendary
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userBadges = pgTable('user_badges', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: text('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade' }),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
});

// Relations
export const pointTransactionsRelations = relations(pointTransactions, ({ one }) => ({
  user: one(users, {
    fields: [pointTransactions.userId],
    references: [users.id],
  }),
}));

export const rewardsRelations = relations(rewards, ({ one }) => ({
  salon: one(salons, {
    fields: [rewards.salonId],
    references: [salons.id],
  }),
}));

export const userRewardsRelations = relations(userRewards, ({ one }) => ({
  user: one(users, {
    fields: [userRewards.userId],
    references: [users.id],
  }),
  reward: one(rewards, {
    fields: [userRewards.rewardId],
    references: [rewards.id],
  }),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));
