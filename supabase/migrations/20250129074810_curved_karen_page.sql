CREATE TABLE IF NOT EXISTS "company_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "company_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_company_id_company_table_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
