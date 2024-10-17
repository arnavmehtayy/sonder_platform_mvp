ALTER TABLE "users_table" ADD COLUMN "user" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD CONSTRAINT "users_table_user_unique" UNIQUE("user");