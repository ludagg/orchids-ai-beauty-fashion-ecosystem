import { pgTable, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { salons, services } from './salons';

export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled', 'no_show']);

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: bookingStatusEnum('status').default('pending').notNull(),
  totalPrice: integer('total_price').notNull(), // Snapshot of price at booking time
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
