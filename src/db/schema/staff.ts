import { pgTable, text, boolean, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { salons, services } from './salons';

export const staff = pgTable('staff', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  role: text('role'), // e.g., "Senior Stylist", "Colorist"
  image: text('image'),
  bio: text('bio'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const staffServices = pgTable('staff_services', {
  staffId: text('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.staffId, t.serviceId] }),
}));

export const staffRelations = relations(staff, ({ one, many }) => ({
  salon: one(salons, {
    fields: [staff.salonId],
    references: [salons.id],
  }),
  services: many(staffServices),
}));

export const staffServicesRelations = relations(staffServices, ({ one }) => ({
  staff: one(staff, {
    fields: [staffServices.staffId],
    references: [staff.id],
  }),
  service: one(services, {
    fields: [staffServices.serviceId],
    references: [services.id],
  }),
}));
