import { pgTable, text, timestamp, boolean, decimal, pgEnum, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth';

export const shopStatusEnum = pgEnum('shop_status', ['pending', 'active', 'suspended']);

export const shops = pgTable('shops', {
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
  image: text('image'),
  status: shopStatusEnum('status').default('pending').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shopImages = pgTable('shop_images', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  caption: text('caption'),
  order: integer('order').default(0),
});

export const shopHours = pgTable('shop_hours', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0-6
  openTime: text('open_time'), // HH:MM
  closeTime: text('close_time'), // HH:MM
  isClosed: boolean('is_closed').default(false).notNull(),
});

export const shopsRelations = relations(shops, ({ one, many }) => ({
  owner: one(users, {
    fields: [shops.ownerId],
    references: [users.id],
  }),
  images: many(shopImages),
  hours: many(shopHours),
}));

export const shopImagesRelations = relations(shopImages, ({ one }) => ({
  shop: one(shops, {
    fields: [shopImages.shopId],
    references: [shops.id],
  }),
}));

export const shopHoursRelations = relations(shopHours, ({ one }) => ({
  shop: one(shops, {
    fields: [shopHours.shopId],
    references: [shops.id],
  }),
}));
