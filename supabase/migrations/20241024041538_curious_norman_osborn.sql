CREATE TABLE IF NOT EXISTS "validation_obj" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"desc" text NOT NULL,
	"answer" jsonb NOT NULL,
	"obj_id" integer NOT NULL,
	"get_attribute_json" jsonb NOT NULL,
	"error" real,
	"relation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validation_score" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"desc" text NOT NULL,
	"score_id" integer NOT NULL,
	"target_score" jsonb NOT NULL,
	"error" real NOT NULL,
	"relation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validation_select" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"desc" text NOT NULL,
	"answer" integer[] NOT NULL,
	"control_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validation_slider" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"desc" text NOT NULL,
	"control_id" integer NOT NULL,
	"target_value" real NOT NULL,
	"error" real NOT NULL,
	"relation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validation_table_control" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"desc" text NOT NULL,
	"answers" jsonb NOT NULL,
	"control_id" integer NOT NULL,
	"error" real NOT NULL,
	"validate_cells" jsonb NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_obj" ADD CONSTRAINT "validation_obj_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_score" ADD CONSTRAINT "validation_score_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_select" ADD CONSTRAINT "validation_select_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_slider" ADD CONSTRAINT "validation_slider_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_table_control" ADD CONSTRAINT "validation_table_control_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
