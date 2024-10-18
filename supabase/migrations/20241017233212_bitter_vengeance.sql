CREATE TABLE IF NOT EXISTS "geom_obj" (
	"state_id" integer NOT NULL,
	"obj_id" integer NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"position_x" real NOT NULL,
	"position_y" real NOT NULL,
	"rotation_x" real NOT NULL,
	"rotation_y" real NOT NULL,
	"rotation_z" real NOT NULL,
	"scale_x" real NOT NULL,
	"scale_y" real NOT NULL,
	"scale_z" real NOT NULL,
	"touch_controls" jsonb,
	"geom_json" jsonb NOT NULL
);
--> statement-breakpoint
DROP TABLE "controls";--> statement-breakpoint
DROP TABLE "influences";--> statement-breakpoint
DROP TABLE "orders";--> statement-breakpoint
DROP TABLE "placements";--> statement-breakpoint
DROP TABLE "questions";--> statement-breakpoint
DROP TABLE "scores";--> statement-breakpoint
DROP TABLE "validations";--> statement-breakpoint
DROP TABLE "vizobjects";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "geom_obj" ADD CONSTRAINT "geom_obj_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
