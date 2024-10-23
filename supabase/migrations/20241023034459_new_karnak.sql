CREATE TABLE IF NOT EXISTS "input_number_control" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"control_id" integer NOT NULL,
	"desc" text NOT NULL,
	"text" text NOT NULL,
	"value" real,
	"placeholder" text,
	"initial_value" real,
	"min" real,
	"max" real,
	"step" real,
	"obj_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "input_number_control" ADD CONSTRAINT "input_number_control_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
