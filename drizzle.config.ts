import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';


config({ path: '.env.development.local' });

export default defineConfig({
  schema: './app/db/schema.tsx',
  out: './supabase/migrations',
  dialect: 'postgresql',
  migrations: {
    prefix: 'supabase',
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
