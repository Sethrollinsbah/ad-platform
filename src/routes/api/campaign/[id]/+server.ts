// src/routes/api/campaign/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { getCampaignDashboard } from '$lib/server/db';

export async function GET({ params }) {
  try {
    const campaignId = parseInt(params.id);
    
    if (isNaN(campaignId)) {
      return json({ error: 'Invalid campaign ID' }, { status: 400 });
    }
    
    const campaignData = await getCampaignDashboard(campaignId);
    return json(campaignData);
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return json({ error: 'Failed to fetch campaign data' }, { status: 500 });
  }
}
