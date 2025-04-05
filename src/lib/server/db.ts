// src/lib/server/db.ts
import postgres from 'postgres';
import type { QueryResult } from 'postgres';

// Environment variables should be set in your .env file
// DATABASE_URL=postgres://username:password@localhost:5432/resads
const pool = postgres({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Execute a SQL query with optional parameters
 * @param text SQL query text
 * @param params Query parameters
 * @returns Promise with query result
 */
export async function query<T>(text: string, params: any[] = []): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a single row by ID
 * @param table Table name
 * @param id Row ID
 * @returns Promise with the row or null if not found
 */
export async function getById<T>(table: string, id: number): Promise<T | null> {
  const res = await query<T>(`SELECT * FROM ${table} WHERE id = $1`, [id]);
  return res.rows[0] || null;
}

/**
 * Insert a row into a table
 * @param table Table name
 * @param data Object with column values
 * @returns Promise with the inserted row
 */
export async function insert<T>(table: string, data: Record<string, any>): Promise<T> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const columns = keys.join(', ');
  
  const text = `
    INSERT INTO ${table} (${columns}) 
    VALUES (${placeholders})
    RETURNING *
  `;
  
  const res = await query<T>(text, values);
  return res.rows[0];
}

/**
 * Update a row in a table
 * @param table Table name
 * @param id Row ID
 * @param data Object with column values to update
 * @returns Promise with the updated row
 */
export async function update<T>(table: string, id: number, data: Record<string, any>): Promise<T | null> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  
  // Create SET clause like "column1 = $1, column2 = $2"
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  
  // Add the ID as the last parameter
  values.push(id);
  
  const text = `
    UPDATE ${table}
    SET ${setClause}
    WHERE id = $${values.length}
    RETURNING *
  `;
  
  const res = await query<T>(text, values);
  return res.rows[0] || null;
}

/**
 * Delete a row from a table
 * @param table Table name
 * @param id Row ID
 * @returns Promise with boolean indicating success
 */
export async function remove(table: string, id: number): Promise<boolean> {
  const res = await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  return res.rowCount > 0;
}

/**
 * Execute a transaction with multiple queries
 * @param callback Function that executes queries within a transaction
 * @returns Promise with the result of the callback
 */
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Specialized query functions for ResAds application

/**
 * Get campaign dashboard data
 * @param campaignId Campaign ID
 * @returns Promise with campaign dashboard data
 */
export async function getCampaignDashboard(campaignId: number) {
  return transaction(async (client) => {
    // Get campaign overview
    const campaignResult = await client.query(
      'SELECT * FROM campaign_overview WHERE id = $1',
      [campaignId]
    );
    const campaign = campaignResult.rows[0];
    
    // Get platform comparison
    const platformsResult = await client.query(
      'SELECT * FROM get_platform_comparison($1)',
      [campaignId]
    );
    const platforms = platformsResult.rows;
    
    // Get conversion breakdown
    const conversionsResult = await client.query(
      'SELECT * FROM get_conversion_breakdown($1)',
      [campaignId]
    );
    const conversions = conversionsResult.rows;
    
    // Get daily performance
    const dailyResult = await client.query(
      'SELECT * FROM campaign_metrics WHERE campaign_id = $1 ORDER BY date',
      [campaignId]
    );
    const dailyMetrics = dailyResult.rows;
    
    // Calculate ROI
    const roiResult = await client.query(
      'SELECT * FROM calculate_campaign_roi($1)',
      [campaignId]
    );
    const roi = roiResult.rows[0];
    
    return {
      campaign,
      platforms,
      conversions,
      dailyMetrics,
      roi
    };
  });
}

/**
 * Get restaurant dashboard data
 * @param restaurantId Restaurant ID
 * @returns Promise with restaurant dashboard data
 */
export async function getRestaurantDashboard(restaurantId: number) {
  return transaction(async (client) => {
    // Get active campaigns
    const campaignsResult = await client.query(
      'SELECT * FROM campaign_overview WHERE id IN (SELECT id FROM campaigns WHERE restaurant_id = $1) ORDER BY start_date DESC',
      [restaurantId]
    );
    const campaigns = campaignsResult.rows;
    
    // Get customer metrics
    const customersResult = await client.query(
      'SELECT * FROM customer_metrics WHERE restaurant_id = $1',
      [restaurantId]
    );
    const customerMetrics = customersResult.rows[0];
    
    // Get recent customers
    const recentCustomersResult = await client.query(
      'SELECT * FROM customers WHERE restaurant_id = $1 ORDER BY created_at DESC LIMIT 10',
      [restaurantId]
    );
    const recentCustomers = recentCustomersResult.rows;
    
    // Get total spent on all campaigns
    const spentResult = await client.query(
      'SELECT SUM(spent) as total_spent FROM campaigns WHERE restaurant_id = $1',
      [restaurantId]
    );
    const totalSpent = spentResult.rows[0].total_spent;
    
    // Get total conversions
    const conversionsResult = await client.query(
      'SELECT SUM(cm.conversions) as total_conversions FROM campaign_metrics cm JOIN campaigns c ON cm.campaign_id = c.id WHERE c.restaurant_id = $1',
      [restaurantId]
    );
    const totalConversions = conversionsResult.rows[0].total_conversions;
    
    return {
      campaigns,
      customerMetrics,
      recentCustomers,
      statistics: {
        totalSpent,
        totalConversions,
        campaignsCount: campaigns.length
      }
    };
  });
}
