CREATE TABLE IF NOT EXISTS "influence_advanced" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"influence_id" integer NOT NULL,
	"worker_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "influence_attribute_pairs" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"influence_id" integer NOT NULL,
	"trans_functionStr" text NOT NULL,
	"trans_symbols" jsonb NOT NULL,
	"func" text NOT NULL,
	"obj_type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validation_input_number" (
	"state_id" integer NOT NULL,
	"answer" real NOT NULL,
	"control_id" integer NOT NULL,
	"error" real NOT NULL,
	"desc" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validation_multi_choice" (
	"state_id" integer NOT NULL,
	"answer" integer[] NOT NULL,
	"control_id" integer NOT NULL,
	"desc" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "influence_advanced" ADD CONSTRAINT "influence_advanced_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "influence_attribute_pairs" ADD CONSTRAINT "influence_attribute_pairs_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_input_number" ADD CONSTRAINT "validation_input_number_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_multi_choice" ADD CONSTRAINT "validation_multi_choice_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
