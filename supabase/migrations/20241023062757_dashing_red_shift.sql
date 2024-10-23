CREATE TABLE IF NOT EXISTS "function_score" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"score_id" integer NOT NULL,
	"text" text NOT NULL,
	"desc" text NOT NULL,
	"function_str" text NOT NULL,
	"function_symbols" jsonb NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "function_score" ADD CONSTRAINT "function_score_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
