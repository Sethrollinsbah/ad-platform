// src/routes/api/restaurant/[id]/customers/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq, sql, count, avg, sum } from 'drizzle-orm';

export async function GET({ params }) {
  try {
    const restaurantId = parseInt(params.id);
    
    if (isNaN(restaurantId)) {
      return json({ error: 'Invalid restaurant ID' }, { status: 400 });
    }
    
    // Get total customer count
    const totalCustomersResult = await db
      .select({ count: count() })
      .from(schema.customers)
      .where(eq(schema.customers.restaurantId, restaurantId));
    
    const totalCustomers = totalCustomersResult[0]?.count || 0;
    
    // Get new customers in last 30 days
    const newCustomers30dResult = await db
      .select({ count: count() })
      .from(schema.customers)
      .where(
        eq(schema.customers.restaurantId, restaurantId),
        sql`created_at >= NOW() - INTERVAL '30 days'`
      );
    
    const newCustomers30d = newCustomers30dResult[0]?.count || 0;
    
    // Get active customers in last 30 days
    const activeCustomers30dResult = await db
      .select({ count: count() })
      .from(schema.customers)
      .where(
        eq(schema.customers.restaurantId, restaurantId),
        sql`last_order_date >= NOW() - INTERVAL '30 days'`
      );
    
    const activeCustomers30d = activeCustomers30dResult[0]?.count || 0;
    
    // Get average orders per customer
    const avgOrdersResult = await db
      .select({ avg: avg(schema.customers.orderCount) })
      .from(schema.customers)
      .where(eq(schema.customers.restaurantId, restaurantId));
    
    const avgOrdersPerCustomer = avgOrdersResult[0]?.avg || 0;
    
    // Get average spend per customer
    const avgSpendResult = await db
      .select({ avg: avg(schema.customers.totalSpent) })
      .from(schema.customers)
      .where(eq(schema.customers.restaurantId, restaurantId));
    
    const avgCustomerSpend = avgSpendResult[0]?.avg || 0;
    
    // Get total revenue
    const totalRevenueResult = await db
      .select({ sum: sum(schema.customers.totalSpent) })
      .from(schema.customers)
      .where(eq(schema.customers.restaurantId, restaurantId));
    
    const totalRevenue = totalRevenueResult[0]?.sum || 0;
    
    // Get repeat rate (customers with more than 1 order)
    const repeatCustomersResult = await db
      .select({ count: count() })
      .from(schema.customers)
      .where(
        eq(schema.customers.restaurantId, restaurantId),
        sql`order_count > 1`
      );
    
    const repeatCustomers = repeatCustomersResult[0]?.count || 0;
    const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
    
    // Get recent customers
    const recentCustomers = await db.query.customers.findMany({
      where: eq(schema.customers.restaurantId, restaurantId),
      orderBy: [sql`created_at DESC`],
      limit: 10
    });
    
    // Get customer acquisition by source
    const acquisitionSources = await db
      .select({
        source: schema.customers.acquisitionSource,
        count: count(),
      })
      .from(schema.customers)
      .where(eq(schema.customers.restaurantId, restaurantId))
      .groupBy(schema.customers.acquisitionSource)
      .orderBy(count());
    
    // Calculate percentages for acquisition sources
    const acquisitionWithPercentage = acquisitionSources.map(source => ({
      acquisition_source: source.source,
      count: source.count,
      percentage: totalCustomers > 0 ? (source.count / totalCustomers) * 100 : 0
    }));
    
    // Get geographic distribution
    const geographicDistribution = await db
      .select({
        city: schema.customers.city,
        count: count(),
      })
      .from(schema.customers)
      .where(eq(schema.customers.restaurantId, restaurantId))
      .groupBy(schema.customers.city)
      .orderBy(count())
      .limit(5);
    
    // Calculate percentages for geographic distribution
    const geographicWithPercentage = geographicDistribution.map(geo => ({
      city: geo.city,
      count: geo.count,
      percentage: totalCustomers > 0 ? (geo.count / totalCustomers) * 100 : 0
    }));
    
    return json({
      metrics: {
        total_customers: totalCustomers,
        new_customers_30d: newCustomers30d,
        active_customers_30d: activeCustomers30d,
        avg_orders_per_customer: avgOrdersPerCustomer,
        avg_customer_spend: avgCustomerSpend,
        total_revenue: totalRevenue,
        repeat_rate: repeatRate
      },
      recentCustomers,
      acquisition: acquisitionWithPercentage,
      geographic: geographicWithPercentage
    });
  } catch (error) {
    console.error('Error fetching customer metrics:', error);
    return json({ error: 'Failed to fetch customer metrics' }, { status: 500 });
  }
}
