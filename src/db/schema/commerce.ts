import { pgTable, text, timestamp, integer, boolean, pgEnum, real, jsonb } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { salons } from './salons';
import { relations } from 'drizzle-orm';

// Enums
export const productStatusEnum = pgEnum('product_status', ['PENDING_REVIEW', 'ACTIVE', 'REJECTED', 'SUSPENDED']);
export const productVisibilityEnum = pgEnum('product_visibility', ['PUBLIC', 'DRAFT', 'SCHEDULED']);
export const productTypeEnum = pgEnum('product_type', ['PHYSICAL', 'DIGITAL']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'reserved', 'paid', 'processing', 'ready_for_pickup', 'shipped', 'delivered', 'cancelled', 'completed']);

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  salonId: text('salon_id').references(() => salons.id),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  description: text('description').notNull(),
  shortDescription: text('short_description'),

  // Categorization
  mainCategory: text('main_category').notNull(),
  subcategory: text('subcategory').notNull(),
  productType: productTypeEnum('product_type').default('PHYSICAL').notNull(),
  tags: text('tags').array(),

  // Pricing & Stock
  originalPrice: integer('original_price').notNull(), // In cents
  salePrice: integer('sale_price'), // In cents, nullable
  saleStartDate: timestamp('sale_start_date'),
  saleEndDate: timestamp('sale_end_date'),
  sku: text('sku'),
  totalStock: integer('total_stock').default(0).notNull(),
  lowStockThreshold: integer('low_stock_threshold').default(5),
  trackInventory: boolean('track_inventory').default(true).notNull(),

  // Variants (JSONB)
  colors: jsonb('colors').$type<any[]>(), // Array of color objects
  sizes: jsonb('sizes').$type<any[]>(), // Array of size objects
  variants: jsonb('variants').$type<any[]>(), // Array of combination objects with stock/price

  // Media
  mainImageUrl: text('main_image_url').notNull(),
  galleryUrls: text('gallery_urls').array().notNull(),
  videoUrl: text('video_url'),

  // Physical Details
  weightGrams: integer('weight_grams'),
  dimensions: jsonb('dimensions').$type<{ length: number, width: number, height: number }>(),
  material: text('material'),
  countryOfOrigin: text('country_of_origin'),
  careInstructions: text('care_instructions'),

  // Shipping
  processingTime: text('processing_time'),
  shippingRegions: text('shipping_regions').array(),
  freeShipping: boolean('free_shipping').default(false),
  shippingCost: integer('shipping_cost'), // In cents
  returnPolicy: text('return_policy'),
  returnConditions: text('return_conditions'),

  // SEO & Visibility
  slug: text('slug').unique().notNull(),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  visibility: productVisibilityEnum('visibility').default('DRAFT').notNull(),
  publishDate: timestamp('publish_date'),
  featured: boolean('featured').default(false),
  status: productStatusEnum('status').default('PENDING_REVIEW').notNull(),

  // Computed / Legacy support (optional)
  rating: real('rating').default(0),
  reviewCount: integer('review_count').default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalAmount: integer('total_amount').notNull(), // In cents
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  shippingAddress: text('shipping_address'),
  pickupDate: timestamp('pickup_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Deprecated: Kept for backward compatibility with existing order management system
export const productVariants = pgTable('product_variants', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').default(0).notNull(),
  options: text('options'),
  sku: text('sku'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  // variantId might refer to an ID inside the variants JSONB, or just be a string key
  variantId: text('variant_id'),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: integer('price_at_purchase').notNull(), // Snapshot price
});

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  salon: one(salons, {
    fields: [products.salonId],
    references: [salons.id],
  }),
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));
