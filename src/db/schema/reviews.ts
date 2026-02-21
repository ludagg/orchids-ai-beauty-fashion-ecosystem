import { pgTable, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { salons } from './salons';
import { users } from './auth';
import { products } from './commerce';
import { bookings } from './bookings';

export const reviewStatusEnum = pgEnum('review_status', ['pending', 'approved', 'rejected']);

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').references(() => salons.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bookingId: text('booking_id').references(() => bookings.id, { onDelete: 'set null' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  images: text('images').array(),
  isVerified: boolean('is_verified').default(false).notNull(),
  helpfulCount: integer('helpful_count').default(0).notNull(),
  status: reviewStatusEnum('status').default('pending').notNull(),
  salonReply: text('salon_reply'),
  salonReplyAt: timestamp('salon_reply_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  salon: one(salons, {
    fields: [reviews.salonId],
    references: [salons.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
}));
