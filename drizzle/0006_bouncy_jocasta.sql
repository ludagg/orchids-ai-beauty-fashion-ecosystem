CREATE TABLE "opening_hours" (
	"id" text PRIMARY KEY NOT NULL,
	"salon_id" text NOT NULL,
	"day_of_week" integer NOT NULL,
	"open_time" text,
	"close_time" text,
	"is_closed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salon_images" (
	"id" text PRIMARY KEY NOT NULL,
	"salon_id" text NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"salon_id" text NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "opening_hours" ADD CONSTRAINT "opening_hours_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salon_images" ADD CONSTRAINT "salon_images_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;