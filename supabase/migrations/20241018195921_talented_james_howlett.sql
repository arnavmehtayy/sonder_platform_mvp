ALTER TABLE "geom_obj" ADD COLUMN "geometry_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "geom_obj" ADD COLUMN "geometry_atts" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "geom_obj" DROP COLUMN IF EXISTS "geom_json";