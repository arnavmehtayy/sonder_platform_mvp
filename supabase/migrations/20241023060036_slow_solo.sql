CREATE TABLE IF NOT EXISTS "enabler_control" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"control_id" integer NOT NULL,
	"desc" text NOT NULL,
	"text" text NOT NULL,
	"obj_ids" integer[] NOT NULL,
	"control_state" boolean NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "enabler_control" ADD CONSTRAINT "enabler_control_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
