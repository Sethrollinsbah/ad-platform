// src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Create a connectionString with a fallback for development
const connectionString = env.DATABASE_URL || 'postgres://root:mysecretpassword@localhost:5432/local';

// Create a postgres client
const client = postgres(connectionString, {
  ssl: env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max: 10, // Connection pool size
  idle_timeout: 20, // How long a connection can be idle before being closed
  connect_timeout: 10 // How long to wait for a connection
});

// Create a drizzle instance
export const db = drizzle(client, { schema });

// Export the schema
export { schema };

// Helper function for queries
export async function query(sql: string, params: any[] = []) {
  return client.unsafe(sql, params);
}

// Helper function to handle common database operations
export async function update(tableName: string, id: number, data: Record<string, any>) {
  try {
    // Construct the SET part of the query
    const setColumns = Object.keys(data)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = [id, ...Object.values(data)];
    
    // Execute the query
    const result = await client.unsafe(
      `UPDATE ${tableName} SET ${setColumns} WHERE id = $1 RETURNING *`,
      values
    );
    
    return result[0];
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error);
    throw error;
  }
}
