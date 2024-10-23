CREATE TABLE IF NOT EXISTS "multi_choice_control" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"control_id" integer NOT NULL,
	"desc" text NOT NULL,
	"text" text NOT NULL,
	"is_multi_select" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "multi_choice_option" (
	"id" serial PRIMARY KEY NOT NULL,
	"multi_choice_control_id" integer NOT NULL,
	"state_id" integer NOT NULL,
	"label" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "multi_choice_control" ADD CONSTRAINT "multi_choice_control_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "multi_choice_option" ADD CONSTRAINT "multi_choice_option_multi_choice_control_id_multi_choice_control_id_fk" FOREIGN KEY ("multi_choice_control_id") REFERENCES "public"."multi_choice_control"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "multi_choice_option" ADD CONSTRAINT "multi_choice_option_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
