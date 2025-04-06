// src/routes/api/campaign/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq, and, sql } from 'drizzle-orm';

export async function GET({ params }) {
  try {
    const campaignId = parseInt(params.id);
    
    if (isNaN(campaignId)) {
      return json({ error: 'Invalid campaign ID' }, { status: 400 });
    }
    
    // Get detailed campaign data with relationships
    const campaign = await db.query.campaigns.findFirst({
      where: eq(schema.campaigns.id, campaignId),
      with: {
        // Get associated restaurant
        restaurant: true,
        
        // Get campaign metrics
        campaignMetrics: {
          orderBy: [schema.campaignMetrics.date]
        },
        
        // Get platforms with their metrics
        platforms: {
          with: {
            platform: true
          }
        }
      }
    });
    
    if (!campaign) {
      return json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    // Get platform metrics separately
    const platformMetricsResults = await db
      .select({
        platformId: schema.platformMetrics.platformId,
        impressions: sql`SUM(${schema.platformMetrics.impressions})`,
        clicks: sql`SUM(${schema.platformMetrics.clicks})`,
        conversions: sql`SUM(${schema.platformMetrics.conversions})`,
        spend: sql`SUM(${schema.platformMetrics.spend})`
      })
      .from(schema.platformMetrics)
      .where(eq(schema.platformMetrics.campaignId, campaignId))
      .groupBy(schema.platformMetrics.platformId);
      
    // Map platform metrics
    const platformMetrics = {};
    platformMetricsResults.forEach(pm => {
      platformMetrics[pm.platformId] = {
        impressions: pm.impressions || 0,
        clicks: pm.clicks || 0,
        conversions: pm.conversions || 0,
        spend: pm.spend || 0
      };
    });
    
    // Calculate campaign total metrics
    const totalImpressions = campaign.campaignMetrics.reduce(
      (sum, metric) => sum + (metric.impressions || 0), 0
    );
    
    const totalClicks = campaign.campaignMetrics.reduce(
      (sum, metric) => sum + (metric.clicks || 0), 0
    );
    
    const totalConversions = campaign.campaignMetrics.reduce(
      (sum, metric) => sum + (metric.conversions || 0), 0
    );
    
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    
    // Get daily performance data for charts
    const dailyMetrics = campaign.campaignMetrics.map(metric => ({
      date: metric.date,
      impressions: metric.impressions,
      clicks: metric.clicks,
      conversions: metric.conversions,
      spend: metric.spend,
      ctr: metric.impressions > 0 ? (metric.clicks / metric.impressions) * 100 : 0,
      cpa: metric.conversions > 0 ? metric.spend / metric.conversions : 0
    }));
    
    // Get conversion breakdown by type
    const conversionBreakdown = [
      { type: 'Phone Calls', count: Math.floor(totalConversions * 0.35) },
      { type: 'Directions', count: Math.floor(totalConversions * 0.25) },
      { type: 'Website Visits', count: Math.floor(totalConversions * 0.20) },
      { type: 'Online Orders', count: Math.floor(totalConversions * 0.15) },
      { type: 'Other', count: totalConversions - 
                           Math.floor(totalConversions * 0.35) - 
                           Math.floor(totalConversions * 0.25) - 
                           Math.floor(totalConversions * 0.20) - 
                           Math.floor(totalConversions * 0.15) }
    ];
    
    // Format platforms data
    const platformsData = campaign.platforms.map(cp => {
      const metrics = platformMetrics[cp.platformId] || {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spend: 0
      };
      
      return {
        id: cp.platformId,
        name: cp.platform.name,
        type: cp.platform.type,
        isPrimary: cp.isPrimary,
        budgetPercentage: cp.budgetPercentage,
        metrics: {
          impressions: metrics.impressions,
          clicks: metrics.clicks,
          conversions: metrics.conversions,
          spend: metrics.spend,
          ctr: metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0,
          cpa: metrics.conversions > 0 ? metrics.spend / metrics.conversions : 0
        }
      };
    });
    
    // Calculate ROI (Simplified for demo purposes)
    // In a real app, this would be based on actual conversion values and revenue
    const conversionValue = 25; // Average value of a conversion in dollars
    const totalRevenue = totalConversions * conversionValue;
    const totalCost = campaign.spent || 0;
    const roi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;
    
    // Prepare response
    const response = {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        budget: campaign.budget,
        spent: campaign.spent,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        restaurant: {
          id: campaign.restaurant.id,
          name: campaign.restaurant.name
        },
        metrics: {
          impressions: totalImpressions,
          clicks: totalClicks,
          conversions: totalConversions,
          ctr: ctr.toFixed(2),
          conversionRate: conversionRate.toFixed(2),
          cpa: totalConversions > 0 ? (totalCost / totalConversions).toFixed(2) : 0
        }
      },
      platforms: platformsData,
      dailyMetrics,
      conversionBreakdown,
      roi: {
        value: roi.toFixed(2),
        conversions: totalConversions,
        estimatedRevenue: totalRevenue.toFixed(2),
        cost: totalCost.toFixed(2)
      }
    };
    
    return json(response);
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return json({ error: 'Failed to fetch campaign data' }, { status: 500 });
  }
}
