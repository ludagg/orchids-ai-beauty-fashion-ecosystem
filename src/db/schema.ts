import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Users table (Adapted for SQLite/LibSQL)
export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => users.id),
});

export const accounts = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const verificationTokens = sqliteTable('verification_token', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// Creator Studio Tables

export const creators = sqliteTable('creator', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  bio: text('bio'),
  specialties: text('specialties'), // Stored as JSON string
  status: text('status').default('pending'), // pending, approved, rejected
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const videos = sqliteTable('video', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id').notNull().references(() => creators.id),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const subscriptions = sqliteTable('subscription', {
  id: text('id').primaryKey(),
  subscriberId: text('subscriber_id').notNull().references(() => users.id),
  creatorId: text('creator_id').notNull().references(() => creators.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
