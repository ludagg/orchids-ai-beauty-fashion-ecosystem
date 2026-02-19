import { pgTable, text, timestamp, boolean, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const genderEnum = pgEnum('gender', ['male', 'female', 'non_binary', 'prefer_not_to_say']);
export const budgetEnum = pgEnum('budget', ['less_than_20', '20_50', '50_100', '100_plus']);
export const morphologyEnum = pgEnum('morphology', ['hourglass', 'pear', 'apple', 'rectangle', 'inverted_triangle']); // Example values, will refine if needed

export const userPreferences = pgTable('user_preferences', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  dob: timestamp('dob'),
  gender: genderEnum('gender'),
  city: text('city'),
  interests: jsonb('interests').$type<string[]>(), // Array of strings
  style: jsonb('style').$type<string[]>(), // Array of strings
  budget: budgetEnum('budget'),
  height: integer('height'), // in cm
  weight: integer('weight'), // in kg, optional
  morphology: morphologyEnum('morphology'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
