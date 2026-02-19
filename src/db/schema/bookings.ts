import { pgTable, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth';
import { salons, services } from './salons';

export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled', 'no_show']);
export const bookingSourceEnum = pgEnum('booking_source', ['web', 'app', 'widget', 'phone', 'walk_in', 'instagram', 'google']);

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  staffId: text('staff_id'), // Optional: specific staff member
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: bookingStatusEnum('status').default('pending').notNull(),
  source: bookingSourceEnum('source').default('web'),
  totalPrice: integer('total_price').notNull(), // Snapshot of price at booking time
  // Cancellation tracking
  cancelledAt: timestamp('cancelled_at'),
  cancelledBy: text('cancelled_by'), // user_id who cancelled
  cancellationReason: text('cancellation_reason'),
  // Check-in tracking
  checkedInAt: timestamp('checked_in_at'),
  checkedInBy: text('checked_in_by'),
  // Completion tracking
  completedAt: timestamp('completed_at'),
  // Client notes
  notes: text('notes'),
  internalNotes: text('internal_notes'), // Private salon notes
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  salon: one(salons, {
    fields: [bookings.salonId],
    references: [salons.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  staff: one(() => import('./staff').then(m => m.staff), {
    fields: [bookings.staffId],
    references: [() => import('./staff').then(m => m.staff).id],
  }),
}));
