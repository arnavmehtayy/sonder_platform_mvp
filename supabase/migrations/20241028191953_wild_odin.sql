ALTER TABLE "users_table" ADD COLUMN "experience_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_table" ADD CONSTRAINT "users_table_experience_id_experience_table_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experience_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
