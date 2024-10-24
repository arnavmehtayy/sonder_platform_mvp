CREATE TABLE IF NOT EXISTS "placement" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"placement_id" integer NOT NULL,
	"object_ids" integer[] NOT NULL,
	"grid" integer[] NOT NULL,
	"cell_size" real NOT NULL,
	"geometry_json" jsonb NOT NULL,
	"grid_vectors" jsonb NOT NULL,
	"text" text NOT NULL,
	"desc" text NOT NULL,
	"color" text NOT NULL,
	"is_clickable" boolean NOT NULL,
	"max_placements" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "placement" ADD CONSTRAINT "placement_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
