CREATE TABLE IF NOT EXISTS "axis_object" (
	"state_id" integer NOT NULL,
	"obj_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
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
	"axis_length" real NOT NULL,
	"tick_spacing" real NOT NULL,
	"tick_size" real NOT NULL,
	"show_labels" boolean NOT NULL,
	"font_size" real NOT NULL,
	"line_width" real NOT NULL,
	"x_label" text NOT NULL,
	"y_label" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dummy_data_storage" (
	"state_id" integer NOT NULL,
	"obj_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"data" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "function_plot_string" (
	"state_id" integer NOT NULL,
	"obj_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
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
	"x_range_a" real NOT NULL,
	"x_range_b" real NOT NULL,
	"num_points" integer NOT NULL,
	"line_width" real NOT NULL,
	"function_str" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "line_obj" (
	"state_id" integer NOT NULL,
	"obj_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"construction_type" text NOT NULL,
	"start_x" real NOT NULL,
	"start_y" real NOT NULL,
	"end_x" real NOT NULL,
	"end_y" real NOT NULL,
	"slope" real,
	"intercept" real,
	"line_width" real NOT NULL,
	"length" real,
	"point1_x" real,
	"point1_y" real,
	"point2_x" real,
	"point2_y" real
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "text_geom" (
	"state_id" integer NOT NULL,
	"obj_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
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
	"geometry_type" text NOT NULL,
	"geometry_atts" jsonb NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "axis_object" ADD CONSTRAINT "axis_object_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dummy_data_storage" ADD CONSTRAINT "dummy_data_storage_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "function_plot_string" ADD CONSTRAINT "function_plot_string_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "line_obj" ADD CONSTRAINT "line_obj_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "text_geom" ADD CONSTRAINT "text_geom_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
