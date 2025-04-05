// src/routes/api/db/setup/+server.ts
import { json } from '@sveltejs/kit';
import { initializeDatabase, seedDatabase, checkDatabaseConnection } from '$lib/server/db-utils';

/**
 * Endpoint to check the database connection
 */
export async function GET() {
  try {
    const connectionStatus = await checkDatabaseConnection();
    return json(connectionStatus);
  } catch (error) {
    console.error('Error checking database connection:', error);
    return json({ connected: false, error: error.message }, { status: 500 });
  }
}

/**
 * Endpoint to initialize and seed the database
 * This is for development purposes only and should be secured in production
 */
export async function POST({ request }) {
  // In a real app, you would check for authentication and authorization here
  try {
    const body = await request.json();
    const { initialize = true, seed = true } = body;
    
    // Check the connection first
    const connectionStatus = await checkDatabaseConnection();
    
    if (!connectionStatus.connected) {
      return json({
        success: false,
        error: 'Database connection failed',
        details: connectionStatus.error
      }, { status: 500 });
    }
    
    let result = {
      connection: connectionStatus,
      initialized: false,
      seeded: false
    };
    
    // Initialize the database if requested
    if (initialize) {
      const initResult = await initializeDatabase();
      result.initialized = initResult;
    }
    
    // Seed the database if requested
    if (seed) {
      const seedResult = await seedDatabase();
      result.seeded = seedResult;
    }
    
    return json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    return json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
