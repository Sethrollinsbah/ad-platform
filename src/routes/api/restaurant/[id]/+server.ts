// src/routes/api/restaurant/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq, sql, count, sum } from 'drizzle-orm';

export async function GET({ params }) {
  try {
    const restaurantId = parseInt(params.id);
    
    if (isNaN(restaurantId)) {
      return json({ error: 'Invalid restaurant ID' }, { status: 400 });
    }
    
    // Get restaurant details
    const restaurant = await db.query.restaurants.findFirst({
      where: eq(schema.restaurants.id, restaurantId)
    });
    
    if (!restaurant) {
      return json({ error: 'Restaurant not found' }, { status: 404 });
    }
    
    // Get active campaigns
    const campaigns = await db.query.campaigns.findMany({
      where: eq(schema.campaigns.restaurantId, restaurantId),
      orderBy: [schema.campaigns.startDate],
      with: {
        campaignMetrics: true,
        platforms: {
          with: {
            platform: true
          }
        }
      }
    });
    
    // Transform campaign data
    const formattedCampaigns = campaigns.map(campaign => {
      // Calculate metrics
      const totalImpressions = campaign.campaignMetrics?.reduce((sum, metric) => sum + (metric.impressions || 0), 0) || 0;
      const totalClicks = campaign.campaignMetrics?.reduce((sum, metric) => sum + (metric.clicks || 0), 0) || 0;
      const totalConversions = campaign.campaignMetrics?.reduce((sum, metric) => sum + (metric.conversions || 0), 0) || 0;
      
      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        budget: campaign.budget,
        spent: campaign.spent,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        metrics: {
          impressions: totalImpressions,
          clicks: totalClicks,
          conversions: totalConversions
        },
        platforms: campaign.platforms.map(cp => ({
          id: cp.platform.id,
          name: cp.platform.name,
          type: cp.platform.type,
          isPrimary: cp.isPrimary,
          budgetPercentage: cp.budgetPercentage
        }))
      };
    });
    
    // Get customer metrics
    const totalCustomers = await db
      .select({ count: count() })
      .from(schema.customers)
      .where(eq(schema.customers.restaurantId, restaurantId));
      
    const newCustomers30d = await db
      .select({ count: count() })
      .from(schema.customers)
      .where(
        eq(schema.customers.restaurantId, restaurantId),
        sql`created_at >= NOW() - INTERVAL '30 days'`
      );
      
    const totalSpent = await db
      .select({ total: sum(schema.campaigns.spent) })
      .from(schema.campaigns)
      .where(eq(schema.campaigns.restaurantId, restaurantId));
      
    // Get recent customers
    const recentCustomers = await db.query.customers.findMany({
      where: eq(schema.customers.restaurantId, restaurantId),
      orderBy: [sql`created_at DESC`],
      limit: 10
    });
    
    // Prepare response object
    const response = {
      restaurant,
      campaigns: formattedCampaigns,
      customerMetrics: {
        totalCustomers: totalCustomers[0]?.count || 0,
        newCustomers30d: newCustomers30d[0]?.count || 0,
      },
      recentCustomers,
      statistics: {
        totalSpent: totalSpent[0]?.total || 0,
        campaignsCount: campaigns.length
      }
    };
    
    return json(response);
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    return json({ error: 'Failed to fetch restaurant data' }, { status: 500 });
  }
}
