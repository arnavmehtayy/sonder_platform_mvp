CREATE TABLE IF NOT EXISTS "input_number_attribute_pairs" (
	"id" serial PRIMARY KEY NOT NULL,
	"control_id" integer NOT NULL,
	"state_id" integer NOT NULL,
	"trans_functionStr" text NOT NULL,
	"trans_symbols" jsonb NOT NULL,
	"func" text NOT NULL,
	"obj_type" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "input_number_attribute_pairs" ADD CONSTRAINT "input_number_attribute_pairs_control_id_input_number_control_id_fk" FOREIGN KEY ("control_id") REFERENCES "public"."input_number_control"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "input_number_attribute_pairs" ADD CONSTRAINT "input_number_attribute_pairs_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
