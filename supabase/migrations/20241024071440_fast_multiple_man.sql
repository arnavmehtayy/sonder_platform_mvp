CREATE TABLE IF NOT EXISTS "question_text" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"placement_id" integer NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_text" ADD CONSTRAINT "question_text_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
