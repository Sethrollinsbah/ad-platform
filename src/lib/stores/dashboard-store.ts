// src/lib/stores/dashboard-store.ts
import { writable } from 'svelte/store';

// Create a store for home dashboard data
export const dashboardData = writable({
  isLoading: false,
  error: null,
  data: null
});

// Create a store for active campaigns
export const activeCampaigns = writable({
  isLoading: false,
  error: null,
  data: []
});

// Create a store for customer metrics
export const customerMetrics = writable({
  isLoading: false,
  error: null,
  data: null
});

// Function to fetch dashboard data
export async function fetchDashboardData(restaurantId: number) {
  if (!restaurantId) return;
  
  // Update store to indicate loading
  dashboardData.update(state => ({
    ...state,
    isLoading: true,
    error: null
  }));
  
  try {
    const response = await fetch(`/api/restaurant/${restaurantId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Update store with fetched data
    dashboardData.update(state => ({
      isLoading: false,
      error: null,
      data
    }));
    
    // Update active campaigns store
    if (data.campaigns) {
      activeCampaigns.set({
        isLoading: false,
        error: null,
        data: data.campaigns
      });
    }
    
    // Update customer metrics store
    if (data.customerMetrics) {
      customerMetrics.set({
        isLoading: false,
        error: null,
        data: data.customerMetrics
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Update store with error
    dashboardData.update(state => ({
      isLoading: false,
      error: error.message,
      data: null
    }));
    
    return null;
  }
}

// Function to fetch active campaigns
export async function fetchActiveCampaigns(restaurantId: number) {
  if (!restaurantId) return;
  
  activeCampaigns.update(state => ({
    ...state,
    isLoading: true,
    error: null
  }));
  
  try {
    const response = await fetch(`/api/restaurant/${restaurantId}/campaigns`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    activeCampaigns.update(state => ({
      isLoading: false,
      error: null,
      data: data
    }));
    
    return data;
  } catch (error) {
    console.error('Error fetching active campaigns:', error);
    
    activeCampaigns.update(state => ({
      isLoading: false,
      error: error.message,
      data: []
    }));
    
    return [];
  }
}

// Function to fetch customer metrics
export async function fetchCustomerMetrics(restaurantId: number) {
  if (!restaurantId) return;
  
  customerMetrics.update(state => ({
    ...state,
    isLoading: true,
    error: null
  }));
  
  try {
    const response = await fetch(`/api/restaurant/${restaurantId}/customers`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    customerMetrics.update(state => ({
      isLoading: false,
      error: null,
      data: data
    }));
    
    return data;
  } catch (error) {
    console.error('Error fetching customer metrics:', error);
    
    customerMetrics.update(state => ({
      isLoading: false,
      error: error.message,
      data: null
    }));
    
    return null;
  }
}
