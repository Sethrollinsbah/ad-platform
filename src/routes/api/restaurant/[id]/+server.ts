// src/routes/api/restaurant/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { getRestaurantDashboard } from '$lib/server/db';

export async function GET({ params }) {
  try {
    const restaurantId = parseInt(params.id);
    
    if (isNaN(restaurantId)) {
      return json({ error: 'Invalid restaurant ID' }, { status: 400 });
    }
    
    const restaurantData = await getRestaurantDashboard(restaurantId);
    return json(restaurantData);
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    return json({ error: 'Failed to fetch restaurant data' }, { status: 500 });
  }
}
