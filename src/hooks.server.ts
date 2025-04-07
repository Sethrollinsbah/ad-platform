// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { initializeDatabase } from '$lib/server/db/init';

// Initialize the database when the server starts
initializeDatabase().catch(err => {
  console.error('Database initialization failed:', err);
});

export const handle: Handle = async ({ event, resolve }) => {
  // Process the request
  const response = await resolve(event);
  return response;
};
