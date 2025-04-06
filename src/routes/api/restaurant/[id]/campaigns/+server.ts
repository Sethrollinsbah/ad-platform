// src/routes/api/restaurant/[id]/campaigns/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { and, eq, sql } from 'drizzle-orm';

export async function GET({ params }) {
  try {
    const restaurantId = parseInt(params.id);
    
    if (isNaN(restaurantId)) {
      return json({ error: 'Invalid restaurant ID' }, { status: 400 });
    }
    
    // Query to get campaigns for the restaurant with metrics aggregation
    const campaigns = await db.query.campaigns.findMany({
      where: eq(schema.campaigns.restaurantId, restaurantId),
      with: {
        // Use relations to fetch related data
        campaignMetrics: true,
        platforms: {
          with: {
            platform: true
          },
          where: eq(schema.campaignPlatforms.isPrimary, true)
        }
      },
      orderBy: [schema.campaigns.startDate]
    });
    
    // Transform the results to match the expected format
    const formattedCampaigns = campaigns.map(campaign => {
      // Calculate metrics
      const totalImpressions = campaign.campaignMetrics?.reduce((sum, metric) => sum + (metric.impressions || 0), 0) || 0;
      const totalClicks = campaign.campaignMetrics?.reduce((sum, metric) => sum + (metric.clicks || 0), 0) || 0;
      const totalConversions = campaign.campaignMetrics?.reduce((sum, metric) => sum + (metric.conversions || 0), 0) || 0;
      
      // Calculate CTR and conversion rate
      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
      
      // Calculate days remaining
      const currentDate = new Date();
      const endDate = campaign.endDate ? new Date(campaign.endDate) : null;
      const daysRemaining = endDate ? Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
      
      // Get primary platform info
      const primaryPlatform = campaign.platforms && campaign.platforms.length > 0
        ? campaign.platforms[0].platform
        : null;
      
      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        budget: campaign.budget,
        spent: campaign.spent,
        start_date: campaign.startDate,
        end_date: campaign.endDate,
        impressions: totalImpressions,
        clicks: totalClicks,
        conversions: totalConversions,
        ctr: ctr.toFixed(2),
        conversion_rate: conversionRate.toFixed(2),
        days_remaining: daysRemaining,
        primary_platform_id: primaryPlatform?.id,
        primary_platform: primaryPlatform?.name
      };
    });
    
    return json(formattedCampaigns);
  } catch (error) {
    console.error('Error fetching campaigns data:', error);
    return json({ error: 'Failed to fetch campaigns data' }, { status: 500 });
  }
}
