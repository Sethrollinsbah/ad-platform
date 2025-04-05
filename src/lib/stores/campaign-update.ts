// src/lib/stores/campaign-update.ts
import { writable } from 'svelte/store';
import { campaignData } from './campaign-store';

// Store for update operation state
export const updateState = writable({
  isUpdating: false,
  error: null,
  success: false,
  message: ''
});

/**
 * Update campaign data in the database
 * @param campaignId - The ID of the campaign to update
 * @param data - The data to update
 */
export async function updateCampaign(campaignId: number, data: Record<string, any>) {
  if (!campaignId) return;
  
  // Update store to indicate operation in progress
  updateState.set({
    isUpdating: true,
    error: null,
    success: false,
    message: 'Updating campaign...'
  });
  
  try {
    // Make API request to update campaign
    const response = await fetch(`/api/campaign/${campaignId}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    // Check if request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update campaign');
    }
    
    // Parse response
    const result = await response.json();
    
    // Update campaign data store with new data
    campaignData.update(state => ({
      ...state,
      data: {
        ...state.data,
        campaign: result.campaign
      }
    }));
    
    // Update update state store
    updateState.set({
      isUpdating: false,
      error: null,
      success: true,
      message: 'Campaign updated successfully!'
    });
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      updateState.update(state => ({
        ...state,
        success: false,
        message: ''
      }));
    }, 3000);
    
    return result;
  } catch (error) {
    console.error('Error updating campaign:', error);
    
    // Update store with error
    updateState.set({
      isUpdating: false,
      error: error.message,
      success: false,
      message: error.message
    });
    
    return null;
  }
}

/**
 * Update platform settings for a campaign
 * @param campaignId - The ID of the campaign
 * @param platformId - The ID of the platform
 * @param data - The platform data to update
 */
export async function updatePlatform(campaignId: number, platformId: number, data: Record<string, any>) {
  if (!campaignId || !platformId) return;
  
  try {
    // First, get the current campaign data
    let currentData;
    campaignData.subscribe(value => {
      currentData = value.data;
    })();
    
    if (!currentData || !currentData.campaign) {
      throw new Error('Campaign data not available');
    }
    
    // Get current platforms
    const platforms = currentData.platforms || [];
    
    // Update the specific platform
    const updatedPlatforms = platforms.map(platform => {
      if (platform.id === platformId) {
        return { ...platform, ...data };
      }
      return platform;
    });
    
    // If platform doesn't exist, add it
    if (!platforms.some(p => p.id === platformId)) {
      updatedPlatforms.push({
        id: platformId,
        ...data
      });
    }
    
    // Update the campaign with updated platforms
    return updateCampaign(campaignId, {
      platforms: updatedPlatforms
    });
  } catch (error) {
    console.error('Error updating platform:', error);
    
    // Update store with error
    updateState.set({
      isUpdating: false,
      error: error.message,
      success: false,
      message: error.message
    });
    
    return null;
  }
}
