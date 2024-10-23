CREATE TABLE IF NOT EXISTS "attribute_pairs" (
	"id" serial PRIMARY KEY NOT NULL,
	"control_id" integer NOT NULL,
	"state_id" integer NOT NULL,
	"transform_function" jsonb NOT NULL,
	"trans_functionStr" text NOT NULL,
	"trans_symbols" jsonb NOT NULL,
	"func" text NOT NULL,
	"obj_type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "slider_control_advanced" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"control_id" integer NOT NULL,
	"desc" text NOT NULL,
	"text" text NOT NULL,
	"obj_id" integer NOT NULL,
	"range" jsonb NOT NULL,
	"step_size" real NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attribute_pairs" ADD CONSTRAINT "attribute_pairs_control_id_slider_control_advanced_id_fk" FOREIGN KEY ("control_id") REFERENCES "public"."slider_control_advanced"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attribute_pairs" ADD CONSTRAINT "attribute_pairs_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "slider_control_advanced" ADD CONSTRAINT "slider_control_advanced_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
