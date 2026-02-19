import { pgTable, text, timestamp, boolean, decimal, pgEnum, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth';

export const salonStatusEnum = pgEnum('salon_status', ['pending', 'active', 'suspended']);

export const salons = pgTable('salons', {
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
  status: salonStatusEnum('status').default('pending').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const salonImages = pgTable('salon_images', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  caption: text('caption'),
  order: integer('order').default(0),
});

export const openingHours = pgTable('opening_hours', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0-6
  openTime: text('open_time'), // HH:MM
  closeTime: text('close_time'), // HH:MM
  isClosed: boolean('is_closed').default(false).notNull(),
});

export const services = pgTable('services', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // Stored in cents
  duration: integer('duration').notNull(), // In minutes
  category: text('category'),
  image: text('image'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const salonsRelations = relations(salons, ({ one, many }) => ({
  owner: one(users, {
    fields: [salons.ownerId],
    references: [users.id],
  }),
  images: many(salonImages),
  openingHours: many(openingHours),
  services: many(services),
}));

export const salonImagesRelations = relations(salonImages, ({ one }) => ({
  salon: one(salons, {
    fields: [salonImages.salonId],
    references: [salons.id],
  }),
}));

export const openingHoursRelations = relations(openingHours, ({ one }) => ({
  salon: one(salons, {
    fields: [openingHours.salonId],
    references: [salons.id],
  }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  salon: one(salons, {
    fields: [services.salonId],
    references: [salons.id],
  }),
}));
