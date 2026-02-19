import { pgTable, text, timestamp, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth';
import { salons } from './salons';
import { bookings } from './bookings';

// Client profiles per salon (CRM data)
export const clientProfiles = pgTable('client_profiles', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  // CRM-specific fields
  firstVisitAt: timestamp('first_visit_at'),
  lastVisitAt: timestamp('last_visit_at'),
  totalVisits: integer('total_visits').default(0),
  totalSpent: integer('total_spent').default(0), // In cents
  preferredStaffId: text('preferred_staff_id'), // Favorite stylist
  notes: text('notes'), // Private salon notes about client
  allergies: text('allergies'),
  preferences: text('preferences'), // Service preferences
  birthday: timestamp('birthday'),
  tags: text('tags').array(), // e.g., ["VIP", "Regular", "Color Client"]
  source: text('source'), // How they found the salon
  isVIP: boolean('is_vip').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Service history for each client (detailed record)
export const serviceHistory = pgTable('service_history', {
  id: text('id').primaryKey(),
  clientProfileId: text('client_profile_id').notNull().references(() => clientProfiles.id, { onDelete: 'cascade' }),
  bookingId: text('booking_id').references(() => bookings.id, { onDelete: 'set null' }),
  serviceName: text('service_name').notNull(), // Snapshot at time of service
  staffName: text('staff_name').notNull(), // Who performed the service
  date: timestamp('date').notNull(),
  price: integer('price'), // In cents
  duration: integer('duration'), // Minutes
  // Detailed service notes
  notes: text('notes'), // What was done
  productsUsed: text('products_used').array(), // Products used during service
  formulas: text('formulas'), // For color services - formula used
  photos: text('photos').array(), // Before/after photos
  clientFeedback: text('client_feedback'),
  rating: integer('rating'), // 1-5
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Client communications log
export const communicationTypeEnum = pgEnum('communication_type', ['call', 'email', 'sms', 'in_person', 'note']);

export const clientCommunications = pgTable('client_communications', {
  id: text('id').primaryKey(),
  clientProfileId: text('client_profile_id').notNull().references(() => clientProfiles.id, { onDelete: 'cascade' }),
  staffId: text('staff_id').references(() => import('./staff').then(m => m.staff).id, { onDelete: 'set null' }),
  type: communicationTypeEnum('type').notNull(),
  direction: text('direction').notNull(), // inbound, outbound
  content: text('content').notNull(),
  followUpRequired: boolean('follow_up_required').default(false),
  followUpDate: timestamp('follow_up_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Marketing campaigns
export const campaignStatusEnum = pgEnum('campaign_status', ['draft', 'scheduled', 'active', 'completed', 'cancelled']);
export const campaignTypeEnum = pgEnum('campaign_type', ['email', 'sms', 'push']);

export const marketingCampaigns = pgTable('marketing_campaigns', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: campaignTypeEnum('type').notNull(),
  status: campaignStatusEnum('status').default('draft').notNull(),
  subject: text('subject'),
  content: text('content').notNull(),
  // Targeting
  targetTags: text('target_tags').array(),
  targetMinVisits: integer('target_min_visits'),
  targetMaxVisits: integer('target_max_visits'),
  targetLastVisitBefore: timestamp('target_last_visit_before'), // Re-engagement
  // Scheduling
  scheduledAt: timestamp('scheduled_at'),
  sentAt: timestamp('sent_at'),
  // Stats
  recipientsCount: integer('recipients_count'),
  openedCount: integer('opened_count'),
  clickedCount: integer('clicked_count'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Campaign recipients
export const campaignRecipients = pgTable('campaign_recipients', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').notNull().references(() => marketingCampaigns.id, { onDelete: 'cascade' }),
  clientProfileId: text('client_profile_id').notNull().references(() => clientProfiles.id, { onDelete: 'cascade' }),
  sentAt: timestamp('sent_at'),
  openedAt: timestamp('opened_at'),
  clickedAt: timestamp('clicked_at'),
  status: text('status').default('pending').notNull(), // pending, sent, delivered, failed
});

export const clientProfilesRelations = relations(clientProfiles, ({ one, many }) => ({
  salon: one(salons, {
    fields: [clientProfiles.salonId],
    references: [salons.id],
  }),
  user: one(users, {
    fields: [clientProfiles.userId],
    references: [users.id],
  }),
  preferredStaff: one(() => import('./staff').then(m => m.staff), {
    fields: [clientProfiles.preferredStaffId],
    references: [() => import('./staff').then(m => m.staff).id],
  }),
  serviceHistory: many(serviceHistory),
  communications: many(clientCommunications),
  campaignRecipients: many(campaignRecipients),
}));

export const serviceHistoryRelations = relations(serviceHistory, ({ one }) => ({
  clientProfile: one(clientProfiles, {
    fields: [serviceHistory.clientProfileId],
    references: [clientProfiles.id],
  }),
  booking: one(bookings, {
    fields: [serviceHistory.bookingId],
    references: [bookings.id],
  }),
}));

export const clientCommunicationsRelations = relations(clientCommunications, ({ one }) => ({
  clientProfile: one(clientProfiles, {
    fields: [clientCommunications.clientProfileId],
    references: [clientProfiles.id],
  }),
  staff: one(() => import('./staff').then(m => m.staff), {
    fields: [clientCommunications.staffId],
    references: [() => import('./staff').then(m => m.staff).id],
  }),
}));

export const marketingCampaignsRelations = relations(marketingCampaigns, ({ one, many }) => ({
  salon: one(salons, {
    fields: [marketingCampaigns.salonId],
    references: [salons.id],
  }),
  recipients: many(campaignRecipients),
}));

// Need to import this at the top but avoiding circular dependency
import { integer } from 'drizzle-orm/pg-core';
