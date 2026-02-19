import { pgTable, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth';
import { salons } from './salons';

export const staffRoleEnum = pgEnum('staff_role', ['owner', 'manager', 'stylist', 'assistant', 'receptionist']);

// Staff members working at salons
export const staff = pgTable('staff', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }), // Optional link to user account
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  role: staffRoleEnum('role').default('stylist').notNull(),
  bio: text('bio'),
  image: text('image'),
  color: text('color'), // For calendar display (hex color)
  isActive: boolean('is_active').default(true).notNull(),
  canAcceptBookings: boolean('can_accept_bookings').default(true).notNull(),
  // Commission settings
  commissionRate: integer('commission_rate').default(0), // Percentage (0-100)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Staff working hours (can override salon hours)
export const staffHours = pgTable('staff_hours', {
  id: text('id').primaryKey(),
  staffId: text('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0-6
  openTime: text('open_time'), // HH:MM
  closeTime: text('close_time'), // HH:MM
  isClosed: boolean('is_closed').default(false).notNull(),
  // Break time
  breakStart: text('break_start'), // HH:MM
  breakEnd: text('break_end'), // HH:MM
});

// Staff vacation/time off
export const staffTimeOff = pgTable('staff_time_off', {
  id: text('id').primaryKey(),
  staffId: text('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  reason: text('reason'),
  isApproved: boolean('is_approved').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Services that each staff member can perform
export const staffServices = pgTable('staff_services', {
  id: text('id').primaryKey(),
  staffId: text('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
  serviceId: text('service_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  isPrimary: boolean('is_primary').default(false).notNull(), // Primary provider for this service
});

export const staffRelations = relations(staff, ({ one, many }) => ({
  salon: one(salons, {
    fields: [staff.salonId],
    references: [salons.id],
  }),
  user: one(users, {
    fields: [staff.userId],
    references: [users.id],
  }),
  hours: many(staffHours),
  timeOff: many(staffTimeOff),
  services: many(staffServices),
  bookings: many(() => import('./bookings').then(m => m.bookings)),
}));

export const staffHoursRelations = relations(staffHours, ({ one }) => ({
  staff: one(staff, {
    fields: [staffHours.staffId],
    references: [staff.id],
  }),
}));

export const staffTimeOffRelations = relations(staffTimeOff, ({ one }) => ({
  staff: one(staff, {
    fields: [staffTimeOff.staffId],
    references: [staff.id],
  }),
}));

export const staffServicesRelations = relations(staffServices, ({ one }) => ({
  staff: one(staff, {
    fields: [staffServices.staffId],
    references: [staff.id],
  }),
}));
