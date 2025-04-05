// src/lib/server/db-utils.ts
import { query, transaction } from './db';

/**
 * Seed the database with initial data for development purposes
 */
export async function seedDatabase() {
  try {
    await transaction(async (client) => {
      // Check if database is already seeded
      const checkResult = await client.query('SELECT COUNT(*) FROM restaurants');
      
      if (parseInt(checkResult.rows[0].count) > 0) {
        console.log('Database already seeded');
        return;
      }
      
      console.log('Seeding database...');
      
      // Create a restaurant
      const restaurantResult = await client.query(
        `INSERT INTO restaurants 
          (name, type, location, contact_email, contact_phone) 
         VALUES 
          ($1, $2, $3, $4, $5)
         RETURNING id`,
        ['Bella Trattoria', 'Italian', 'Miami, FL', 'contact@bellatrattoria.com', '(555) 123-4567']
      );
      
      const restaurantId = restaurantResult.rows[0].id;
      
      // Create some campaigns
      const campaignIds = [];
      const campaigns = [
        {
          name: 'Weekend Special Promotion',
          status: 'Active',
          budget: 1200,
          spent: 487.25,
          start_date: '2025-03-01',
          end_date: '2025-04-15',
          restaurant_id: restaurantId
        },
        {
          name: 'Happy Hour Promo',
          status: 'Scheduled',
          budget: 800, 
          spent: 0,
          start_date: '2025-04-01',
          end_date: '2025-04-30',
          restaurant_id: restaurantId
        },
        {
          name: 'Summer Menu Launch',
          status: 'Draft',
          budget: 1500,
          spent: 0,
          start_date: '2025-05-15',
          end_date: '2025-06-15',
          restaurant_id: restaurantId
        }
      ];
      
      for (const campaign of campaigns) {
        const result = await client.query(
          `INSERT INTO campaigns 
            (name, status, budget, spent, start_date, end_date, restaurant_id)
           VALUES 
            ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id`,
          [campaign.name, campaign.status, campaign.budget, campaign.spent, campaign.start_date, campaign.end_date, campaign.restaurant_id]
        );
        
        campaignIds.push(result.rows[0].id);
      }
      
      // Create platforms
      const platformIds = [];
      const platforms = [
        { name: 'Instagram', type: 'Social' },
        { name: 'Facebook', type: 'Social' },
        { name: 'Google', type: 'Search' },
        { name: 'Email', type: 'Email' }
      ];
      
      for (const platform of platforms) {
        const result = await client.query(
          `INSERT INTO platforms (name, type) VALUES ($1, $2) RETURNING id`,
          [platform.name, platform.type]
        );
        
        platformIds.push(result.rows[0].id);
      }
      
      // Associate platforms with campaigns
      await client.query(
        `INSERT INTO campaign_platforms (campaign_id, platform_id, is_primary, budget_percentage) VALUES
         ($1, $2, true, 35),
         ($1, $3, false, 25),
         ($1, $4, false, 40)`,
        [campaignIds[0], platformIds[0], platformIds[1], platformIds[2]]
      );
      
      // Add campaign metrics
      const campaignMetrics = [
        // For Weekend Special campaign (last 7 days)
        { campaign_id: campaignIds[0], date: '2025-03-24', impressions: 3500, clicks: 180, conversions: 15, spend: 65.50 },
        { campaign_id: campaignIds[0], date: '2025-03-25', impressions: 3700, clicks: 195, conversions: 18, spend: 70.25 },
        { campaign_id: campaignIds[0], date: '2025-03-26', impressions: 3650, clicks: 185, conversions: 16, spend: 68.75 },
        { campaign_id: campaignIds[0], date: '2025-03-27', impressions: 3800, clicks: 210, conversions: 20, spend: 75.00 },
        { campaign_id: campaignIds[0], date: '2025-03-28', impressions: 4200, clicks: 230, conversions: 22, spend: 82.50 },
        { campaign_id: campaignIds[0], date: '2025-03-29', impressions: 4500, clicks: 250, conversions: 25, spend: 90.00 },
        { campaign_id: campaignIds[0], date: '2025-03-30', impressions: 4000, clicks: 220, conversions: 21, spend: 78.25 }
      ];
      
      for (const metric of campaignMetrics) {
        await client.query(
          `INSERT INTO campaign_metrics 
            (campaign_id, date, impressions, clicks, conversions, spend)
           VALUES 
            ($1, $2, $3, $4, $5, $6)`,
          [metric.campaign_id, metric.date, metric.impressions, metric.clicks, metric.conversions, metric.spend]
        );
      }
      
      // Add platform metrics
      const platformMetrics = [
        // Instagram
        { campaign_id: campaignIds[0], platform_id: platformIds[0], date: '2025-03-30', impressions: 2000, clicks: 110, conversions: 12, spend: 35.00 },
        // Facebook
        { campaign_id: campaignIds[0], platform_id: platformIds[1], date: '2025-03-30', impressions: 1500, clicks: 75, conversions: 6, spend: 22.50 },
        // Google
        { campaign_id: campaignIds[0], platform_id: platformIds[2], date: '2025-03-30', impressions: 500, clicks: 35, conversions: 3, spend: 17.75 }
      ];
      
      for (const metric of platformMetrics) {
        await client.query(
          `INSERT INTO platform_metrics 
            (campaign_id, platform_id, date, impressions, clicks, conversions, spend)
           VALUES 
            ($1, $2, $3, $4, $5, $6, $7)`,
          [metric.campaign_id, metric.platform_id, metric.date, metric.impressions, metric.clicks, metric.conversions, metric.spend]
        );
      }
      
      // Add sample customers
      const customers = [
        { name: 'John Smith', email: 'john.smith@example.com', phone: '(555) 111-2222', city: 'Miami', acquisition_source: 'Website', order_count: 5, total_spent: 245.80 },
        { name: 'Maria Garcia', email: 'maria.g@example.com', phone: '(555) 222-3333', city: 'Miami', acquisition_source: 'Instagram', order_count: 3, total_spent: 157.50 },
        { name: 'Robert Johnson', email: 'rjohnson@example.com', phone: '(555) 333-4444', city: 'Coral Gables', acquisition_source: 'Google', order_count: 2, total_spent: 87.25 },
        { name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '(555) 444-5555', city: 'Miami Beach', acquisition_source: 'Referral', order_count: 7, total_spent: 312.40 },
        { name: 'Michael Davis', email: 'mdavis@example.com', phone: '(555) 555-6666', city: 'Miami', acquisition_source: 'Facebook', order_count: 1, total_spent: 42.75 }
      ];
      
      for (const customer of customers) {
        await client.query(
          `INSERT INTO customers 
            (name, email, phone, city, acquisition_source, order_count, total_spent, restaurant_id, created_at, last_order_date)
           VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - (RANDOM() * INTERVAL '60 days'), NOW() - (RANDOM() * INTERVAL '15 days'))`,
          [customer.name, customer.email, customer.phone, customer.city, customer.acquisition_source, customer.order_count, customer.total_spent, restaurantId]
        );
      }
      
      console.log('Seeding completed successfully!');
    });
    
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

/**
 * Initialize the database tables if they don't exist
 */
export async function initializeDatabase() {
  try {
    await transaction(async (client) => {
      // Check if restaurants table exists
      const checkResult = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'restaurants'
        )`);
      
      if (checkResult.rows[0].exists) {
        console.log('Database already initialized');
        return;
      }
      
      console.log('Initializing database schema...');
      
      // Create restaurants table
      await client.query(`
        CREATE TABLE restaurants (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(100),
          location VARCHAR(255),
          contact_email VARCHAR(255),
          contact_phone VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      
      // Create campaigns table
      await client.query(`
        CREATE TABLE campaigns (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          status VARCHAR(50) NOT NULL,
          budget DECIMAL(10,2) NOT NULL,
          spent DECIMAL(10,2) DEFAULT 0,
          start_date DATE,
          end_date DATE,
          restaurant_id INTEGER REFERENCES restaurants(id),
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      
      // Create platforms table
      await client.query(`
        CREATE TABLE platforms (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          type VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      
      // Create campaign_platforms join table
      await client.query(`
        CREATE TABLE campaign_platforms (
          campaign_id INTEGER REFERENCES campaigns(id),
          platform_id INTEGER REFERENCES platforms(id),
          is_primary BOOLEAN DEFAULT false,
          budget_percentage INTEGER,
          PRIMARY KEY (campaign_id, platform_id)
        )`);
      
      // Create campaign_metrics table
      await client.query(`
        CREATE TABLE campaign_metrics (
          id SERIAL PRIMARY KEY,
          campaign_id INTEGER REFERENCES campaigns(id),
          date DATE NOT NULL,
          impressions INTEGER DEFAULT 0,
          clicks INTEGER DEFAULT 0,
          conversions INTEGER DEFAULT 0,
          spend DECIMAL(10,2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      
      // Create platform_metrics table
      await client.query(`
        CREATE TABLE platform_metrics (
          id SERIAL PRIMARY KEY,
          campaign_id INTEGER REFERENCES campaigns(id),
          platform_id INTEGER REFERENCES platforms(id),
          date DATE NOT NULL,
          impressions INTEGER DEFAULT 0,
          clicks INTEGER DEFAULT 0,
          conversions INTEGER DEFAULT 0,
          spend DECIMAL(10,2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        )`);
      
      // Create customers table
      await client.query(`
        CREATE TABLE customers (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          city VARCHAR(100),
          acquisition_source VARCHAR(100),
          order_count INTEGER DEFAULT 0,
          total_spent DECIMAL(10,2) DEFAULT 0,
          restaurant_id INTEGER REFERENCES restaurants(id),
          created_at TIMESTAMP DEFAULT NOW(),
          last_order_date TIMESTAMP
        )`);
      
      // Create customer_conversions table
      await client.query(`
        CREATE TABLE customer_conversions (
          id SERIAL PRIMARY KEY,
          customer_id INTEGER REFERENCES customers(id),
          campaign_id INTEGER REFERENCES campaigns(id),
          platform_id INTEGER REFERENCES platforms(id),
          conversion_type VARCHAR(50) NOT NULL,
          conversion_value DECIMAL(10,2) DEFAULT 0,
          conversion_date TIMESTAMP DEFAULT NOW()
        )`);
      
      console.log('Database schema initialized successfully!');
    });
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

/**
 * Check if the database is connected and initialized
 */
export async function checkDatabaseConnection() {
  try {
    const result = await query('SELECT NOW() as now');
    return {
      connected: true,
      timestamp: result.rows[0].now
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      connected: false,
      error: error.message
    };
  }
}
