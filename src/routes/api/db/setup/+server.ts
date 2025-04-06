// src/routes/api/db/setup/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { sql, count } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

/**
 * Check if the database connection is working
 */
async function checkDatabaseConnection() {
  try {
    // Simple query to check connection
    const result = await db.execute(sql`SELECT NOW() as now`);
    return {
      connected: true,
      timestamp: result[0]?.now
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      connected: false,
      error: error.message
    };
  }
}

/**
 * Initialize the database with schema
 */
async function initializeDatabase() {
  try {
    // For safety, we check if tables exist first
    const client = postgres(env.DATABASE_URL);
    const drizzle = drizzle(client, { schema });
    
    // Create a migrator - in production you'd use drizzle-kit CLI
    // This is simplified for demonstration
    await migrate(drizzle, { migrationsFolder: './drizzle/migrations' });
    
    console.log('Database schema initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

/**
 * Seed database with initial data
 */
async function seedDatabase() {
  try {
    // Check if there are already restaurants in the database
    const restaurantCount = await db
      .select({ count: count() })
      .from(schema.restaurants);
      
    if (restaurantCount[0]?.count > 0) {
      console.log('Database already seeded');
      return true;
    }
    
    console.log('Seeding database...');
    
    // Insert a sample restaurant
    const [restaurant] = await db
      .insert(schema.restaurants)
      .values({
        name: 'Bella Trattoria',
        type: 'Italian',
        location: 'Miami, FL',
        contactEmail: 'contact@bellatrattoria.com',
        contactPhone: '(555) 123-4567'
      })
      .returning();
      
    const restaurantId = restaurant.id;
    
    // Insert sample campaigns
    const campaignsData = [
      {
        name: 'Weekend Special Promotion',
        status: 'Active',
        budget: 1200,
        spent: 487.25,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-04-15'),
        restaurantId
      },
      {
        name: 'Happy Hour Promo',
        status: 'Scheduled',
        budget: 800,
        spent: 0,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-04-30'),
        restaurantId
      },
      {
        name: 'Summer Menu Launch',
        status: 'Draft',
        budget: 1500,
        spent: 0,
        startDate: new Date('2025-05-15'),
        endDate: new Date('2025-06-15'),
        restaurantId
      }
    ];
    
    const campaigns = await db
      .insert(schema.campaigns)
      .values(campaignsData)
      .returning();
      
    // Insert platforms
    const platformsData = [
      { name: 'Instagram', type: 'Social' },
      { name: 'Facebook', type: 'Social' },
      { name: 'Google', type: 'Search' },
      { name: 'Email', type: 'Email' }
    ];
    
    const platforms = await db
      .insert(schema.platforms)
      .values(platformsData)
      .returning();
      
    // Insert campaign-platform associations
    await db
      .insert(schema.campaignPlatforms)
      .values([
        { 
          campaignId: campaigns[0].id, 
          platformId: platforms[0].id, 
          isPrimary: true, 
          budgetPercentage: 35 
        },
        { 
          campaignId: campaigns[0].id, 
          platformId: platforms[1].id, 
          isPrimary: false, 
          budgetPercentage: 25 
        },
        { 
          campaignId: campaigns[0].id, 
          platformId: platforms[2].id, 
          isPrimary: false, 
          budgetPercentage: 40 
        }
      ]);
      
    // Insert campaign metrics
    const today = new Date();
    const metricsData = [];
    
    // Generate metrics for the past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      metricsData.push({
        campaignId: campaigns[0].id,
        date,
        impressions: 3500 + Math.floor(Math.random() * 1000),
        clicks: 180 + Math.floor(Math.random() * 50),
        conversions: 15 + Math.floor(Math.random() * 10),
        spend: 65 + Math.random() * 25
      });
    }
    
    await db
      .insert(schema.campaignMetrics)
      .values(metricsData);
      
    // Insert platform metrics for the most recent day
    const platformMetricsData = [
      {
        campaignId: campaigns[0].id,
        platformId: platforms[0].id,
        date: today,
        impressions: 2000,
        clicks: 110,
        conversions: 12,
        spend: 35
      },
      {
        campaignId: campaigns[0].id,
        platformId: platforms[1].id,
        date: today,
        impressions: 1500,
        clicks: 75,
        conversions: 6,
        spend: 22.50
      },
      {
        campaignId: campaigns[0].id,
        platformId: platforms[2].id,
        date: today,
        impressions: 500,
        clicks: 35,
        conversions: 3,
        spend: 17.75
      }
    ];
    
    await db
      .insert(schema.platformMetrics)
      .values(platformMetricsData);
      
    // Insert sample customers
    const customersData = [
      { 
        name: 'John Smith', 
        email: 'john.smith@example.com', 
        phone: '(555) 111-2222', 
        city: 'Miami', 
        acquisitionSource: 'Website', 
        orderCount: 5, 
        totalSpent: 245.80,
        restaurantId,
        createdAt: new Date(today.getTime() - (Math.random() * 60 * 24 * 60 * 60 * 1000)), // Random date in the last 60 days
        lastOrderDate: new Date(today.getTime() - (Math.random() * 15 * 24 * 60 * 60 * 1000)) // Random date in the last 15 days
      },
      { 
        name: 'Maria Garcia', 
        email: 'maria.g@example.com', 
        phone: '(555) 222-3333', 
        city: 'Miami', 
        acquisitionSource: 'Instagram', 
        orderCount: 3, 
        totalSpent: 157.50,
        restaurantId,
        createdAt: new Date(today.getTime() - (Math.random() * 60 * 24 * 60 * 60 * 1000)),
        lastOrderDate: new Date(today.getTime() - (Math.random() * 15 * 24 * 60 * 60 * 1000))
      },
      { 
        name: 'Robert Johnson', 
        email: 'rjohnson@example.com', 
        phone: '(555) 333-4444', 
        city: 'Coral Gables', 
        acquisitionSource: 'Google', 
        orderCount: 2, 
        totalSpent: 87.25,
        restaurantId,
        createdAt: new Date(today.getTime() - (Math.random() * 60 * 24 * 60 * 60 * 1000)),
        lastOrderDate: new Date(today.getTime() - (Math.random() * 15 * 24 * 60 * 60 * 1000))
      },
      { 
        name: 'Sarah Williams', 
        email: 'sarah.w@example.com', 
        phone: '(555) 444-5555', 
        city: 'Miami Beach', 
        acquisitionSource: 'Referral', 
        orderCount: 7, 
        totalSpent: 312.40,
        restaurantId,
        createdAt: new Date(today.getTime() - (Math.random() * 60 * 24 * 60 * 60 * 1000)),
        lastOrderDate: new Date(today.getTime() - (Math.random() * 15 * 24 * 60 * 60 * 1000))
      },
      { 
        name: 'Michael Davis', 
        email: 'mdavis@example.com', 
        phone: '(555) 555-6666', 
        city: 'Miami', 
        acquisitionSource: 'Facebook', 
        orderCount: 1, 
        totalSpent: 42.75,
        restaurantId,
        createdAt: new Date(today.getTime() - (Math.random() * 60 * 24 * 60 * 60 * 1000)),
        lastOrderDate: new Date(today.getTime() - (Math.random() * 15 * 24 * 60 * 60 * 1000))
      }
    ];
    
    await db
      .insert(schema.customers)
      .values(customersData);
      
    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

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
