CREATE TYPE "public"."product_status" AS ENUM('PENDING_REVIEW', 'ACTIVE', 'REJECTED', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('PHYSICAL', 'DIGITAL');--> statement-breakpoint
CREATE TYPE "public"."product_visibility" AS ENUM('PUBLIC', 'DRAFT', 'SCHEDULED');--> statement-breakpoint
CREATE TYPE "public"."cart_status" AS ENUM('active', 'abandoned', 'converted');--> statement-breakpoint
ALTER TYPE "public"."salon_status" ADD VALUE 'rejected';--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" text PRIMARY KEY NOT NULL,
	"cart_id" text NOT NULL,
	"product_id" text NOT NULL,
	"variant_id" text,
	"selected_options" jsonb,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status" "cart_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"admin_id" text,
	"action" text NOT NULL,
	"target_id" text NOT NULL,
	"target_type" text NOT NULL,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_variant_id_product_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "brand" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "social_links" text;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "logo" text;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "formatted_address" text;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "registration_number" text;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "id_document_url" text;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "business_proof_url" text;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "gallery_urls" text[];--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "short_description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "main_category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "subcategory" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "product_type" "product_type" DEFAULT 'PHYSICAL' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "tags" text[];--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "original_price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sale_price" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sale_start_date" timestamp;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sale_end_date" timestamp;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sku" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "total_stock" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "low_stock_threshold" integer DEFAULT 5;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "track_inventory" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "colors" jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sizes" jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "variants" jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "main_image_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "gallery_urls" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "video_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "weight_grams" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "dimensions" jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "material" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "country_of_origin" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "care_instructions" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "processing_time" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "shipping_regions" text[];--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "free_shipping" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "shipping_cost" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "return_policy" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "return_conditions" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "meta_title" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "visibility" "product_visibility" DEFAULT 'DRAFT' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "publish_date" timestamp;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "status" "product_status" DEFAULT 'PENDING_REVIEW' NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "stock";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "has_variants";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "images";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_slug_unique" UNIQUE("slug");