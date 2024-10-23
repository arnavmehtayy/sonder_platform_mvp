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
