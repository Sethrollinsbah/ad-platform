// src/routes/api/campaign/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';

export async function GET({ params }) {
  try {
    // Extract campaignId from params
    const campaignIdParam = params.id;
    
    if (!campaignIdParam) {
      return json({ error: 'Campaign ID is required' }, { status: 400 });
    }
    
    // First try to find the campaign by name in node ID format
    const campaigns = await db
      .select()
      .from(schema.campaigns)
      .where(schema.campaigns.name.toLowerCase().like(`%${campaignIdParam.toLowerCase().replace(/-/g, ' ')}%`))
      .limit(1);
      
    if (campaigns.length === 0) {
      return json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    const campaign = campaigns[0];
    
    // Get campaign metrics
    const campaignMetrics = await db
      .select()
      .from(schema.campaignMetrics)
      .where(eq(schema.campaignMetrics.campaignId, campaign.id))
      .orderBy(schema.campaignMetrics.date);
      
    // Get campaign platforms
    const campaignPlatforms = await db
      .select({
        cp: schema.campaignPlatforms,
        p: schema.platforms
      })
      .from(schema.campaignPlatforms)
      .where(eq(schema.campaignPlatforms.campaignId, campaign.id))
      .innerJoin(
        schema.platforms,
        eq(schema.campaignPlatforms.platformId, schema.platforms.id)
      );
      
    const platforms = campaignPlatforms.map(item => ({
      id: item.p.id,
      name: item.p.name,
      type: item.p.type,
      isPrimary: item.cp.isPrimary,
      budgetPercentage: item.cp.budgetPercentage
    }));
    
    // Calculate aggregate metrics
    const totalImpressions = campaignMetrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
    const totalClicks = campaignMetrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
    const totalConversions = campaignMetrics.reduce((sum, m) => sum + (m.conversions || 0), 0);
    const totalSpent = campaignMetrics.reduce((sum, m) => sum + (parseFloat(m.spend) || 0), 0);
    
    // Calculate performance metrics
    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0.00';
    const cpa = totalConversions > 0 ? (totalSpent / totalConversions).toFixed(2) : '0.00';
    
    // Format campaign metrics for chart
    const dailyMetrics = campaignMetrics.map(metric => ({
      date: metric.date.toISOString().split('T')[0],
      impressions: metric.impressions || 0,
      clicks: metric.clicks || 0,
      conversions: metric.conversions || 0,
      spend: parseFloat(metric.spend) || 0
    }));
    
    // Generate conversion breakdown
    // In a real application, this would come from actual data
    const conversionBreakdown = [
      { type: 'Phone Calls', count: Math.round(totalConversions * 0.35) },
      { type: 'Directions', count: Math.round(totalConversions * 0.20) },
      { type: 'Online Orders', count: Math.round(totalConversions * 0.30) },
      { type: 'Reservations', count: totalConversions - Math.round(totalConversions * 0.35) - Math.round(totalConversions * 0.20) - Math.round(totalConversions * 0.30) }
    ];
    
    // Format response
    const response = {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        budget: parseFloat(campaign.budget),
        spent: parseFloat(campaign.spent || '0'),
        startDate: campaign.startDate.toISOString().split('T')[0],
        endDate: campaign.endDate.toISOString().split('T')[0],
        metrics: {
          impressions: totalImpressions,
          clicks: totalClicks,
          conversions: totalConversions,
          ctr,
          conversionRate,
          cpa
        }
      },
      platforms,
      dailyMetrics,
      conversionBreakdown
    };
    
    return json(response);
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return json({ error: 'Failed to fetch campaign data' }, { status: 500 });
  }
}
