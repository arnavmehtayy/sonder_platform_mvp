CREATE TABLE IF NOT EXISTS "attribute_pairs" (
	"id" serial PRIMARY KEY NOT NULL,
	"control_id" integer NOT NULL,
	"state_id" integer NOT NULL,
	"trans_functionStr" text NOT NULL,
	"trans_symbols" jsonb NOT NULL,
	"func" text NOT NULL,
	"obj_type" text NOT NULL
);
--> statement-breakpoint
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
	"function_str" text NOT NULL,
	"symbols" jsonb NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "geom_obj" (
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
	"geometry_atts" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "input_number_attribute_pairs" (
	"id" serial PRIMARY KEY NOT NULL,
	"control_id" integer NOT NULL,
	"state_id" integer NOT NULL,
	"trans_functionStr" text NOT NULL,
	"trans_symbols" jsonb NOT NULL,
	"func" text NOT NULL,
	"obj_type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "input_number_control" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"control_id" integer NOT NULL,
	"desc" text NOT NULL,
	"text" text NOT NULL,
	"value" real,
	"placeholder" text,
	"initial_value" real,
	"min" real,
	"max" real,
	"step" real,
	"obj_id" integer
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
CREATE TABLE IF NOT EXISTS "multi_choice_control" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"control_id" integer NOT NULL,
	"desc" text NOT NULL,
	"text" text NOT NULL,
	"is_multi_select" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "multi_choice_option" (
	"id" serial PRIMARY KEY NOT NULL,
	"multi_choice_control_id" integer NOT NULL,
	"state_id" integer NOT NULL,
	"label" text NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "question_text" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"placement_id" integer NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "select_control" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"control_id" integer NOT NULL,
	"desc" text NOT NULL,
	"text" text NOT NULL,
	"selectable" integer[] NOT NULL,
	"selected" integer[] NOT NULL,
	"is_active" boolean NOT NULL,
	"capacity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "slider_control_advanced" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"control_id" integer NOT NULL,
	"desc" text NOT NULL,
	"text" text NOT NULL,
	"obj_id" integer NOT NULL,
	"range" jsonb NOT NULL,
	"step_size" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "table_cell" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"table_control_id" integer NOT NULL,
	"row_index" integer NOT NULL,
	"column_index" integer NOT NULL,
	"value" real NOT NULL,
	"trans_functionStr" text NOT NULL,
	"trans_symbols" jsonb NOT NULL,
	"obj_id" integer NOT NULL,
	"obj_type" text NOT NULL,
	"attribute" text NOT NULL,
	"is_static" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "table_control" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"control_id" integer NOT NULL,
	"desc" text NOT NULL,
	"text" text NOT NULL,
	"column_headers" text[] NOT NULL,
	"row_headers" text[] NOT NULL
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
CREATE TABLE IF NOT EXISTS "validation_obj" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"desc" text NOT NULL,
	"answer" jsonb NOT NULL,
	"obj_id" integer NOT NULL,
	"get_attribute_json" jsonb NOT NULL,
	"error" real,
	"relation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validation_score" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"desc" text NOT NULL,
	"score_id" integer NOT NULL,
	"target_score" jsonb NOT NULL,
	"error" real NOT NULL,
	"relation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validation_select" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"desc" text NOT NULL,
	"answer" integer[] NOT NULL,
	"control_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validation_slider" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"desc" text NOT NULL,
	"control_id" integer NOT NULL,
	"target_value" real NOT NULL,
	"error" real NOT NULL,
	"relation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validation_table_control" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"desc" text NOT NULL,
	"answers" jsonb NOT NULL,
	"control_id" integer NOT NULL,
	"error" real NOT NULL,
	"validate_cells" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "experience_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"desc" text NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"type" text NOT NULL,
	"item_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_name" text NOT NULL,
	"camera_zoom" real DEFAULT 20,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_state_name_unique" UNIQUE("state_name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attribute_pairs" ADD CONSTRAINT "attribute_pairs_control_id_slider_control_advanced_id_fk" FOREIGN KEY ("control_id") REFERENCES "public"."slider_control_advanced"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attribute_pairs" ADD CONSTRAINT "attribute_pairs_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
 ALTER TABLE "enabler_control" ADD CONSTRAINT "enabler_control_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "function_score" ADD CONSTRAINT "function_score_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "geom_obj" ADD CONSTRAINT "geom_obj_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "input_number_attribute_pairs" ADD CONSTRAINT "input_number_attribute_pairs_control_id_input_number_control_id_fk" FOREIGN KEY ("control_id") REFERENCES "public"."input_number_control"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "input_number_attribute_pairs" ADD CONSTRAINT "input_number_attribute_pairs_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "input_number_control" ADD CONSTRAINT "input_number_control_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "multi_choice_control" ADD CONSTRAINT "multi_choice_control_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "multi_choice_option" ADD CONSTRAINT "multi_choice_option_multi_choice_control_id_multi_choice_control_id_fk" FOREIGN KEY ("multi_choice_control_id") REFERENCES "public"."multi_choice_control"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "multi_choice_option" ADD CONSTRAINT "multi_choice_option_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "placement" ADD CONSTRAINT "placement_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_text" ADD CONSTRAINT "question_text_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "select_control" ADD CONSTRAINT "select_control_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "slider_control_advanced" ADD CONSTRAINT "slider_control_advanced_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "table_cell" ADD CONSTRAINT "table_cell_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "table_cell" ADD CONSTRAINT "table_cell_table_control_id_table_control_id_fk" FOREIGN KEY ("table_control_id") REFERENCES "public"."table_control"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "table_control" ADD CONSTRAINT "table_control_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "text_geom" ADD CONSTRAINT "text_geom_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_obj" ADD CONSTRAINT "validation_obj_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_score" ADD CONSTRAINT "validation_score_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_select" ADD CONSTRAINT "validation_select_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_slider" ADD CONSTRAINT "validation_slider_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validation_table_control" ADD CONSTRAINT "validation_table_control_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_state_id_users_table_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
