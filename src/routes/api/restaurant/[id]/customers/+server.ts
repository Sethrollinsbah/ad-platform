// src/routes/api/restaurant/[id]/customers/+server.ts
import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db';

export async function GET({ params }) {
  try {
    const restaurantId = parseInt(params.id);
    
    if (isNaN(restaurantId)) {
      return json({ error: 'Invalid restaurant ID' }, { status: 400 });
    }
    
    // Query to get customer metrics for the restaurant
    const metricsResult = await query(
      `SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_customers_30d,
        COUNT(CASE WHEN last_order_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as active_customers_30d,
        COALESCE(AVG(order_count), 0) as avg_orders_per_customer,
        COALESCE(AVG(total_spent), 0) as avg_customer_spend,
        COALESCE(SUM(total_spent), 0) as total_revenue,
        COUNT(CASE WHEN order_count > 1 THEN 1 END)::float / NULLIF(COUNT(*), 0) * 100 as repeat_rate
      FROM customers
      WHERE restaurant_id = $1`,
      [restaurantId]
    );
    
    // Get recent customers
    const recentCustomersResult = await query(
      `SELECT id, name, email, phone, city, created_at, last_order_date, order_count, total_spent
      FROM customers
      WHERE restaurant_id = $1
      ORDER BY created_at DESC
      LIMIT 10`,
      [restaurantId]
    );
    
    // Get customer acquisition by source
    const acquisitionResult = await query(
      `SELECT 
        acquisition_source, 
        COUNT(*) as count,
        COUNT(*)::float / (SELECT COUNT(*) FROM customers WHERE restaurant_id = $1) * 100 as percentage
      FROM customers
      WHERE restaurant_id = $1
      GROUP BY acquisition_source
      ORDER BY count DESC`,
      [restaurantId]
    );
    
    // Get customer geographic distribution
    const geographicResult = await query(
      `SELECT 
        city, 
        COUNT(*) as count,
        COUNT(*)::float / (SELECT COUNT(*) FROM customers WHERE restaurant_id = $1) * 100 as percentage
      FROM customers
      WHERE restaurant_id = $1
      GROUP BY city
      ORDER BY count DESC
      LIMIT 5`,
      [restaurantId]
    );
    
    const metrics = metricsResult.rows[0] || {};
    
    return json({
      metrics,
      recentCustomers: recentCustomersResult.rows,
      acquisition: acquisitionResult.rows,
      geographic: geographicResult.rows
    });
  } catch (error) {
    console.error('Error fetching customer metrics:', error);
    return json({ error: 'Failed to fetch customer metrics' }, { status: 500 });
  }
}
