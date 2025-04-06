// src/routes/api/campaign/[id]/update/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';

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
    
    // Permitted fields for update with mapping to schema fields
    const allowedFields = [
      'name',
      'status',
      'budget',
      'spent',
      'startDate',
      'endDate'
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
    const updatedCampaign = await db
      .update(schema.campaigns)
      .set(updateData)
      .where(eq(schema.campaigns.id, campaignId))
      .returning();
    
    if (!updatedCampaign || updatedCampaign.length === 0) {
      return json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    // Handle platform updates if provided
    if (data.platforms && Array.isArray(data.platforms)) {
      // First, delete existing platform associations
      await db
        .delete(schema.campaignPlatforms)
        .where(eq(schema.campaignPlatforms.campaignId, campaignId));
      
      // Then add the new ones
      const platformsToInsert = data.platforms
        .filter(platform => platform.id && platform.budgetPercentage !== undefined)
        .map(platform => ({
          campaignId,
          platformId: platform.id,
          isPrimary: platform.isPrimary || false,
          budgetPercentage: platform.budgetPercentage
        }));
      
      if (platformsToInsert.length > 0) {
        await db
          .insert(schema.campaignPlatforms)
          .values(platformsToInsert);
      }
    }
    
    // Get updated campaign with platforms
    const campaign = await db.query.campaigns.findFirst({
      where: eq(schema.campaigns.id, campaignId),
      with: {
        platforms: {
          with: {
            platform: true
          }
        }
      }
    });
    
    // Format the campaign data for response
    const formattedCampaign = {
      ...campaign,
      platforms: campaign?.platforms.map(cp => ({
        id: cp.platform.id,
        name: cp.platform.name,
        type: cp.platform.type,
        is_primary: cp.isPrimary,
        budget_percentage: cp.budgetPercentage
      }))
    };
    
    return json({
      success: true,
      campaign: formattedCampaign
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}
