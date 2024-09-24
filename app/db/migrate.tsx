import { drizzle } from 'drizzle-orm/postgres-js';
import "dotenv/config"
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from 'postgres';

const migrationClient = postgres(process.env.DATABASE_URL as string,
    {max: 1}
);

async function main() {
    await migrate(drizzle(migrationClient), { migrationsFolder: './supabase/migrations' });
    await migrationClient.end();
}

main();
