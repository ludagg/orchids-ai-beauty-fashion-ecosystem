-- Complete Booking System Migration
-- Adds staff management, booking policies, and CRM features

-- Staff management enums and tables
CREATE TYPE "public"."staff_role" AS ENUM('owner', 'manager', 'stylist', 'assistant', 'receptionist');

CREATE TABLE "staff" (
	"id" text PRIMARY KEY NOT NULL,
	"salon_id" text NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"role" "staff_role" DEFAULT 'stylist' NOT NULL,
	"bio" text,
	"image" text,
	"color" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"can_accept_bookings" boolean DEFAULT true NOT NULL,
	"commission_rate" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "staff_hours" (
	"id" text PRIMARY KEY NOT NULL,
	"staff_id" text NOT NULL,
	"day_of_week" integer NOT NULL,
	"open_time" text,
	"close_time" text,
	"is_closed" boolean DEFAULT false NOT NULL,
	"break_start" text,
	"break_end" text
);

CREATE TABLE "staff_time_off" (
	"id" text PRIMARY KEY NOT NULL,
	"staff_id" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"reason" text,
	"is_approved" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "staff_services" (
	"id" text PRIMARY KEY NOT NULL,
	"staff_id" text NOT NULL,
	"service_id" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL
);

-- Booking policies enums and tables
CREATE TYPE "public"."cancellation_policy_type" AS ENUM('flexible', 'moderate', 'strict', 'custom');
CREATE TYPE "public"."deposit_status" AS ENUM('pending', 'held', 'charged', 'refunded', 'released');
CREATE TYPE "public"."reminder_type" AS ENUM('email', 'sms', 'push');

CREATE TABLE "cancellation_policies" (
	"id" text PRIMARY KEY NOT NULL,
	"salon_id" text NOT NULL,
	"policy_type" "cancellation_policy_type" DEFAULT 'moderate' NOT NULL,
	"free_cancellation_hours" integer DEFAULT 24 NOT NULL,
	"late_cancellation_fee" integer DEFAULT 50,
	"no_show_fee" integer DEFAULT 100,
	"custom_policy_text" text,
	"require_card" boolean DEFAULT false NOT NULL,
	"require_deposit" boolean DEFAULT false NOT NULL,
	"deposit_percentage" integer DEFAULT 30,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "booking_deposits" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"amount" integer NOT NULL,
	"status" "deposit_status" DEFAULT 'pending' NOT NULL,
	"payment_intent_id" text,
	"captured_at" timestamp,
	"refunded_at" timestamp,
	"refund_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "booking_reminders" (
	"id" text PRIMARY KEY NOT NULL,
	"salon_id" text NOT NULL,
	"reminder_type" "reminder_type" DEFAULT 'email' NOT NULL,
	"hours_before" integer NOT NULL,
	"message_template" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "sent_reminders" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"reminder_type" "reminder_type" NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"status" text NOT NULL,
	"error_message" text
);

-- CRM enums and tables
CREATE TYPE "public"."communication_type" AS ENUM('call', 'email', 'sms', 'in_person', 'note');
CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'scheduled', 'active', 'completed', 'cancelled');
CREATE TYPE "public"."campaign_type" AS ENUM('email', 'sms', 'push');

CREATE TABLE "client_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"salon_id" text NOT NULL,
	"user_id" text NOT NULL,
	"first_visit_at" timestamp,
	"last_visit_at" timestamp,
	"total_visits" integer DEFAULT 0,
	"total_spent" integer DEFAULT 0,
	"preferred_staff_id" text,
	"notes" text,
	"allergies" text,
	"preferences" text,
	"birthday" timestamp,
	"tags" text[],
	"source" text,
	"is_vip" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "service_history" (
	"id" text PRIMARY KEY NOT NULL,
	"client_profile_id" text NOT NULL,
	"booking_id" text,
	"service_name" text NOT NULL,
	"staff_name" text NOT NULL,
	"date" timestamp NOT NULL,
	"price" integer,
	"duration" integer,
	"notes" text,
	"products_used" text[],
	"formulas" text,
	"photos" text[],
	"client_feedback" text,
	"rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "client_communications" (
	"id" text PRIMARY KEY NOT NULL,
	"client_profile_id" text NOT NULL,
	"staff_id" text,
	"type" "communication_type" NOT NULL,
	"direction" text NOT NULL,
	"content" text NOT NULL,
	"follow_up_required" boolean DEFAULT false,
	"follow_up_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "marketing_campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"salon_id" text NOT NULL,
	"name" text NOT NULL,
	"type" "campaign_type" NOT NULL,
	"status" "campaign_status" DEFAULT 'draft' NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"target_tags" text[],
	"target_min_visits" integer,
	"target_max_visits" integer,
	"target_last_visit_before" timestamp,
	"scheduled_at" timestamp,
	"sent_at" timestamp,
	"recipients_count" integer,
	"opened_count" integer,
	"clicked_count" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "campaign_recipients" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"client_profile_id" text NOT NULL,
	"sent_at" timestamp,
	"opened_at" timestamp,
	"clicked_at" timestamp,
	"status" text DEFAULT 'pending' NOT NULL
);

-- Add new columns to existing bookings table
CREATE TYPE "public"."booking_source" AS ENUM('web', 'app', 'widget', 'phone', 'walk_in', 'instagram', 'google');

ALTER TABLE "bookings" ADD COLUMN "staff_id" text;
ALTER TABLE "bookings" ADD COLUMN "source" "booking_source" DEFAULT 'web';
ALTER TABLE "bookings" ADD COLUMN "cancelled_at" timestamp;
ALTER TABLE "bookings" ADD COLUMN "cancelled_by" text;
ALTER TABLE "bookings" ADD COLUMN "cancellation_reason" text;
ALTER TABLE "bookings" ADD COLUMN "checked_in_at" timestamp;
ALTER TABLE "bookings" ADD COLUMN "checked_in_by" text;
ALTER TABLE "bookings" ADD COLUMN "completed_at" timestamp;
ALTER TABLE "bookings" ADD COLUMN "internal_notes" text;

-- Foreign keys
ALTER TABLE "staff" ADD CONSTRAINT "staff_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "staff_hours" ADD CONSTRAINT "staff_hours_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "staff_time_off" ADD CONSTRAINT "staff_time_off_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "staff_services" ADD CONSTRAINT "staff_services_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "staff_services" ADD CONSTRAINT "staff_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "cancellation_policies" ADD CONSTRAINT "cancellation_policies_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_deposits" ADD CONSTRAINT "booking_deposits_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "booking_reminders" ADD CONSTRAINT "booking_reminders_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "sent_reminders" ADD CONSTRAINT "sent_reminders_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_preferred_staff_id_staff_id_fk" FOREIGN KEY ("preferred_staff_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "service_history" ADD CONSTRAINT "service_history_client_profile_id_client_profiles_id_fk" FOREIGN KEY ("client_profile_id") REFERENCES "public"."client_profiles"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "service_history" ADD CONSTRAINT "service_history_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "client_communications" ADD CONSTRAINT "client_communications_client_profile_id_client_profiles_id_fk" FOREIGN KEY ("client_profile_id") REFERENCES "public"."client_profiles"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "client_communications" ADD CONSTRAINT "client_communications_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "marketing_campaigns" ADD CONSTRAINT "marketing_campaigns_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_campaign_id_marketing_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."marketing_campaigns"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_client_profile_id_client_profiles_id_fk" FOREIGN KEY ("client_profile_id") REFERENCES "public"."client_profiles"("id") ON DELETE cascade ON UPDATE no action;

-- Add foreign key for bookings.staff_id
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;

-- Create indexes for performance
CREATE INDEX "idx_staff_salon_id" ON "staff" ("salon_id");
CREATE INDEX "idx_staff_hours_staff_id" ON "staff_hours" ("staff_id");
CREATE INDEX "idx_staff_time_off_staff_id" ON "staff_time_off" ("staff_id");
CREATE INDEX "idx_staff_services_staff_id" ON "staff_services" ("staff_id");
CREATE INDEX "idx_staff_services_service_id" ON "staff_services" ("service_id");

CREATE INDEX "idx_cancellation_policies_salon_id" ON "cancellation_policies" ("salon_id");
CREATE INDEX "idx_booking_deposits_booking_id" ON "booking_deposits" ("booking_id");
CREATE INDEX "idx_booking_reminders_salon_id" ON "booking_reminders" ("salon_id");
CREATE INDEX "idx_sent_reminders_booking_id" ON "sent_reminders" ("booking_id");

CREATE INDEX "idx_client_profiles_salon_id" ON "client_profiles" ("salon_id");
CREATE INDEX "idx_client_profiles_user_id" ON "client_profiles" ("user_id");
CREATE INDEX "idx_service_history_client_profile_id" ON "service_history" ("client_profile_id");
CREATE INDEX "idx_client_communications_client_profile_id" ON "client_communications" ("client_profile_id");
CREATE INDEX "idx_marketing_campaigns_salon_id" ON "marketing_campaigns" ("salon_id");
CREATE INDEX "idx_campaign_recipients_campaign_id" ON "campaign_recipients" ("campaign_id");

CREATE INDEX "idx_bookings_staff_id" ON "bookings" ("staff_id");
CREATE INDEX "idx_bookings_cancelled_at" ON "bookings" ("cancelled_at");
CREATE INDEX "idx_bookings_checked_in_at" ON "bookings" ("checked_in_at");
