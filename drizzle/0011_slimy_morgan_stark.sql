CREATE TYPE "public"."review_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'review';--> statement-breakpoint
CREATE TABLE "staff" (
	"id" text PRIMARY KEY NOT NULL,
	"salon_id" text NOT NULL,
	"name" text NOT NULL,
	"role" text,
	"image" text,
	"bio" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_services" (
	"staff_id" text NOT NULL,
	"service_id" text NOT NULL,
	CONSTRAINT "staff_services_staff_id_service_id_pk" PRIMARY KEY("staff_id","service_id")
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"icon" text NOT NULL,
	"condition" text NOT NULL,
	"points_bonus" integer DEFAULT 0,
	"rarity" text DEFAULT 'common',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "point_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"reference_id" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" text PRIMARY KEY NOT NULL,
	"salon_id" text,
	"name" text NOT NULL,
	"description" text,
	"cost" integer NOT NULL,
	"type" text NOT NULL,
	"value" integer,
	"image" text,
	"quantity" integer,
	"is_active" boolean DEFAULT true,
	"valid_until" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"badge_id" text NOT NULL,
	"unlocked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_levels" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"min_points" integer NOT NULL,
	"multiplier" numeric(3, 2) DEFAULT '1.0',
	"benefits" text[],
	"badge_image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_rewards" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"reward_id" text NOT NULL,
	"status" text DEFAULT 'active',
	"redeemed_at" timestamp DEFAULT now(),
	"used_at" timestamp,
	"code" text NOT NULL,
	CONSTRAINT "user_rewards_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "average_rating" numeric(3, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "total_reviews" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "staff_id" text;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "booking_id" text;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "images" text[];--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "helpful_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "status" "review_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "salon_reply" text;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "salon_reply_at" timestamp;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_services" ADD CONSTRAINT "staff_services_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_services" ADD CONSTRAINT "staff_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;