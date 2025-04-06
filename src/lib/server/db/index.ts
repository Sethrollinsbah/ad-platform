// src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Ensure DATABASE_URL is set
if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a postgres client
const client = postgres(env.DATABASE_URL, {
  ssl: env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

// Create a drizzle instance
export const db = drizzle(client, { schema });

// Export the schema
export { schema };

// Helper function to log query execution time (optional)
export const logQueryTime = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  const start = Date.now();
  try {
    return await fn();
  } finally {
    const duration = Date.now() - start;
    console.log(`Query '${name}' took ${duration}ms`);
  }
};
