// src/routes/api/restaurant/[id]/campaigns/+server.ts
import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db';

export async function GET({ params }) {
  try {
    const restaurantId = parseInt(params.id);
    
    if (isNaN(restaurantId)) {
      return json({ error: 'Invalid restaurant ID' }, { status: 400 });
    }
    
    // Query to get active campaigns for the restaurant
    const campaignsResult = await query(
      `SELECT c.id, c.name, c.status, c.budget, c.spent, c.start_date, c.end_date,
       COALESCE(SUM(cm.impressions), 0) as impressions,
       COALESCE(SUM(cm.clicks), 0) as clicks,
       COALESCE(SUM(cm.conversions), 0) as conversions,
       CASE WHEN COALESCE(SUM(cm.impressions), 0) > 0 
            THEN (COALESCE(SUM(cm.clicks), 0) / COALESCE(SUM(cm.impressions), 0)) * 100 
            ELSE 0 
       END as ctr,
       CASE WHEN COALESCE(SUM(cm.clicks), 0) > 0 
            THEN (COALESCE(SUM(cm.conversions), 0) / COALESCE(SUM(cm.clicks), 0)) * 100 
            ELSE 0 
       END as conversion_rate,
       EXTRACT(DAY FROM (c.end_date - CURRENT_DATE)) as days_remaining,
       p.id as primary_platform_id,
       p.name as primary_platform
       FROM campaigns c
       LEFT JOIN campaign_metrics cm ON c.id = cm.campaign_id
       LEFT JOIN campaign_platforms cp ON c.id = cp.campaign_id
       LEFT JOIN platforms p ON cp.platform_id = p.id AND cp.is_primary = true
       WHERE c.restaurant_id = $1
       GROUP BY c.id, p.id, p.name
       ORDER BY c.start_date DESC`,
      [restaurantId]
    );
    
    return json(campaignsResult.rows);
  } catch (error) {
    console.error('Error fetching campaigns data:', error);
    return json({ error: 'Failed to fetch campaigns data' }, { status: 500 });
  }
}
