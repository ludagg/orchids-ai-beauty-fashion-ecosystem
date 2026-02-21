import { pgTable, text, timestamp, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth';

export const notificationTypeEnum = pgEnum('notification_type', ['booking', 'message', 'system', 'order', 'promotion', 'review']);

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link'),
  isRead: boolean('is_read').default(false).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
