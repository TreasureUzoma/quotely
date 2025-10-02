CREATE TYPE "public"."user_auth_method" AS ENUM('email', 'google', 'github');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'superadmin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended', 'read-only');--> statement-breakpoint
CREATE TYPE "public"."user_subscription" AS ENUM('free', 'paid', 'enterprise');--> statement-breakpoint
CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"bg_color" text NOT NULL,
	"created_by_uuid" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "notes_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"google_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"auth_method" "user_auth_method" DEFAULT 'google',
	"status" "user_status" DEFAULT 'active',
	"role" "user_role" DEFAULT 'user',
	"subscription_type" "user_subscription" DEFAULT 'free',
	CONSTRAINT "user_google_id_unique" UNIQUE("google_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_created_by_uuid_user_id_fk" FOREIGN KEY ("created_by_uuid") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;