CREATE TABLE IF NOT EXISTS "controls" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"control_id" integer NOT NULL,
	"control_data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "influences" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"master_id" integer NOT NULL,
	"influence_data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"type" text NOT NULL,
	"item_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "placements" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"placement_id" integer NOT NULL,
	"placement_data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer,
	"question_id" integer NOT NULL,
	"question_text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"score_id" integer NOT NULL,
	"score_data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_name" text NOT NULL,
	"camera_zoom" real DEFAULT 20,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_state_name_unique" UNIQUE("state_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validations" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"validation_data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vizobjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"obj_id" integer NOT NULL,
	"obj_data" jsonb NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "controls" ADD CONSTRAINT "controls_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "influences" ADD CONSTRAINT "influences_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "placements" ADD CONSTRAINT "placements_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scores" ADD CONSTRAINT "scores_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validations" ADD CONSTRAINT "validations_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vizobjects" ADD CONSTRAINT "vizobjects_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
