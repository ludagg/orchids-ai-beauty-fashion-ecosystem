import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const activityLogs = pgTable('activity_logs', {
  id: text('id').primaryKey(),
  adminId: text('admin_id').references(() => users.id),
  action: text('action').notNull(), // e.g., 'approve_salon', 'suspend_user'
  targetId: text('target_id').notNull(),
  targetType: text('target_type').notNull(), // 'salon', 'user', 'product'
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
