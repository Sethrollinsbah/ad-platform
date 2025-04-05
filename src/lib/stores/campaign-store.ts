// src/lib/stores/campaign-store.ts
import { writable } from 'svelte/store';

// Create a store for campaign data
export const campaignData = writable({
  isLoading: false,
  error: null,
  data: null
});

// Function to fetch campaign data from the API
export async function fetchCampaignData(campaignId) {
  if (!campaignId) return;
  
  // Update store to indicate loading
  campaignData.update(state => ({
    ...state,
    isLoading: true,
    error: null
  }));
  
  try {
    const response = await fetch(`/api/campaign/${campaignId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Update store with fetched data
    campaignData.update(state => ({
      isLoading: false,
      error: null,
      data
    }));
    
    return data;
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    
    // Update store with error
    campaignData.update(state => ({
      isLoading: false,
      error: error.message,
      data: null
    }));
    
    return null;
  }
}

// Function to fetch restaurant dashboard data
export async function fetchRestaurantData(restaurantId) {
  if (!restaurantId) return;
  
  try {
    const response = await fetch(`/api/restaurant/${restaurantId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    return null;
  }
}
