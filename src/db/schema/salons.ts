import { pgTable, text, timestamp, boolean, decimal, pgEnum, integer } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const salonStatusEnum = pgEnum('salon_status', ['pending', 'active', 'suspended']);
export const partnerTypeEnum = pgEnum('partner_type', ['SALON', 'BOUTIQUE', 'BOTH']);

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
  status: salonStatusEnum('status').default('pending').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  type: partnerTypeEnum('type').default('SALON').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const services = pgTable('services', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // Stored in cents
  duration: integer('duration').notNull(), // In minutes
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
