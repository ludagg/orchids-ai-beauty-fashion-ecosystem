import { pgTable, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { salons } from './salons';

// Cancellation policies for salons
export const cancellationPolicyEnum = pgEnum('cancellation_policy_type', ['flexible', 'moderate', 'strict', 'custom']);

export const cancellationPolicies = pgTable('cancellation_policies', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  policyType: cancellationPolicyEnum('policy_type').default('moderate').notNull(),
  // Hours before appointment when cancellation is allowed without penalty
  freeCancellationHours: integer('free_cancellation_hours').default(24).notNull(),
  // Penalty percentage if cancelled after free period (0-100)
  lateCancellationFee: integer('late_cancellation_fee').default(50),
  // No-show fee percentage (0-100)
  noShowFee: integer('no_show_fee').default(100),
  // Custom policy description
  customPolicyText: text('custom_policy_text'),
  // Require credit card for booking
  requireCard: boolean('require_card').default(false).notNull(),
  // Deposit required
  requireDeposit: boolean('require_deposit').default(false).notNull(),
  depositPercentage: integer('deposit_percentage').default(30),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Deposits/Payments for bookings
export const depositStatusEnum = pgEnum('deposit_status', ['pending', 'held', 'charged', 'refunded', 'released']);

export const bookingDeposits = pgTable('booking_deposits', {
  id: text('id').primaryKey(),
  bookingId: text('booking_id').notNull().references(() => import('./bookings').then(m => m.bookings).id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(), // In cents
  status: depositStatusEnum('status').default('pending').notNull(),
  // Stripe payment intent ID
  paymentIntentId: text('payment_intent_id'),
  // For authorization holds
  capturedAt: timestamp('captured_at'),
  refundedAt: timestamp('refunded_at'),
  refundReason: text('refund_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Reminders and notifications settings
export const reminderTypeEnum = pgEnum('reminder_type', ['email', 'sms', 'push']);

export const bookingReminders = pgTable('booking_reminders', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  reminderType: reminderTypeEnum('reminder_type').default('email').notNull(),
  // Hours before appointment to send reminder
  hoursBefore: integer('hours_before').notNull(),
  // Message template
  messageTemplate: text('message_template'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Sent reminders log
export const sentReminders = pgTable('sent_reminders', {
  id: text('id').primaryKey(),
  bookingId: text('booking_id').notNull().references(() => import('./bookings').then(m => m.bookings).id, { onDelete: 'cascade' }),
  reminderType: reminderTypeEnum('reminder_type').notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  status: text('status').notNull(), // sent, delivered, failed
  errorMessage: text('error_message'),
});

export const cancellationPoliciesRelations = relations(cancellationPolicies, ({ one }) => ({
  salon: one(salons, {
    fields: [cancellationPolicies.salonId],
    references: [salons.id],
  }),
}));

export const bookingRemindersRelations = relations(bookingReminders, ({ one }) => ({
  salon: one(salons, {
    fields: [bookingReminders.salonId],
    references: [salons.id],
  }),
}));
