CREATE TABLE IF NOT EXISTS "experience_videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"experience_id" integer NOT NULL,
	"index" integer NOT NULL,
	"video_path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "experience_videos" ADD CONSTRAINT "experience_videos_experience_id_experience_table_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experience_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
