// src/routes/api/campaign/[id]/update/+server.ts
import { json } from '@sveltejs/kit';
import { update, query } from '$lib/server/db';

export async function POST({ params, request }) {
  try {
    const campaignId = parseInt(params.id);
    
    if (isNaN(campaignId)) {
      return json({ error: 'Invalid campaign ID' }, { status: 400 });
    }
    
    // Get request body
    const data = await request.json();
    
    // Validate data
    if (!data) {
      return json({ error: 'No data provided' }, { status: 400 });
    }
    
    // Permitted fields for update
    const allowedFields = [
      'name', 'status', 'budget', 'spent', 'start_date', 'end_date'
    ];
    
    // Extract only allowed fields
    const updateData: Record<string, any> = {};
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }
    
    // If no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return json({ error: 'No valid fields to update' }, { status: 400 });
    }
    
    // Update the campaign
    const updatedCampaign = await update('campaigns', campaignId, updateData);
    
    if (!updatedCampaign) {
      return json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    // Handle platform updates if provided
    if (data.platforms && Array.isArray(data.platforms)) {
      // First, delete existing platform associations
      await query(
        'DELETE FROM campaign_platforms WHERE campaign_id = $1',
        [campaignId]
      );
      
      // Then add the new ones
      for (const platform of data.platforms) {
        if (platform.id && platform.budget_percentage) {
          await query(
            `INSERT INTO campaign_platforms 
              (campaign_id, platform_id, is_primary, budget_percentage) 
             VALUES 
              ($1, $2, $3, $4)`,
            [campaignId, platform.id, platform.is_primary || false, platform.budget_percentage]
          );
        }
      }
    }
    
    // Get updated campaign with platforms
    const campaignResult = await query(
      `SELECT c.*, 
       ARRAY_AGG(DISTINCT jsonb_build_object(
         'id', p.id, 
         'name', p.name, 
         'type', p.type, 
         'is_primary', cp.is_primary, 
         'budget_percentage', cp.budget_percentage
       )) as platforms
       FROM campaigns c
       LEFT JOIN campaign_platforms cp ON c.id = cp.campaign_id
       LEFT JOIN platforms p ON cp.platform_id = p.id
       WHERE c.id = $1
       GROUP BY c.id`,
      [campaignId]
    );
    
    return json({
      success: true,
      campaign: campaignResult.rows[0]
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}
