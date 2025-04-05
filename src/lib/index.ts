// src/lib/index.ts

import { writable } from 'svelte/store';
import { nodes } from './stores/node-store';

// Settings panel store
export let settingsPanel = writable<{
  id: string | null;
  type: string | null;
  icon?: string | null;
  data?: any
}>({
  id: null,
  type: null,
  icon: null,
  data: null
});

// Export the nodes store
export { nodes };

// Re-export other stores and types for easy access
export * from './stores/node-store';
export * from './types/node-types';
export * from './registry/node-registry';
export * from './init/node-init';

export let projectId = writable<String>("planetbun")

export let projects = writable<{id: string, name: String}[]>([
    { 
      id: 'nike-sportswear', 
      name: 'Nike Sportswear', 
      lastUpdated: new Date(2025, 2, 25), // March 25, 2025
      services: [ 
        { id: 'srv-1', name: 'Summer Collection Social Media', active: true }, 
        { id: 'srv-2', name: 'Athletic Performance YouTube', active: true }, 
        { id: 'srv-3', name: 'Basketball Influencer Partnerships', active: true } 
      ], 
      active: true 
    },
    { 
      id: 'starbucks-seasonal', 
      name: 'Starbucks', 
      lastUpdated: new Date(2025, 2, 28), // March 28, 2025
      services: [ 
        { id: 'srv-4', name: 'Spring Drink Promotion', active: true }, 
        { id: 'srv-5', name: 'Loyalty Program Email Campaign', active: false } 
      ], 
      active: true 
    },
    { 
      id: 'amazon-prime', 
      name: 'Amazon Prime', 
      lastUpdated: new Date(2025, 2, 15), // March 15, 2025
      services: [ 
        { id: 'srv-6', name: 'Prime Day Banner Ads', active: true }, 
        { id: 'srv-7', name: 'Free Shipping Promotion', active: true }, 
        { id: 'srv-8', name: 'Prime Video Display Ads', active: true }, 
        { id: 'srv-9', name: 'Student Discount Campaign', active: true } 
      ], 
      active: false 
    },
    { 
      id: 'spotify-premium', 
      name: 'Spotify Premium', 
      lastUpdated: new Date(2025, 2, 29), // March 29, 2025
      services: [ 
        { id: 'srv-10', name: 'Family Plan Promotion', active: true }, 
        { id: 'srv-11', name: 'Podcast Listener Targeting', active: true }, 
        { id: 'srv-12', name: 'Free Trial Email Series', active: false } 
      ], 
      active: true 
    },
    { 
      id: 'tesla-models', 
      name: 'Tesla Motors', 
      lastUpdated: new Date(2025, 1, 20), // February 20, 2025
      services: [ 
        { id: 'srv-13', name: 'Model 3 Facebook Campaign', active: true }, 
        { id: 'srv-14', name: 'Cybertruck Pre-order Promotion', active: true }, 
        { id: 'srv-15', name: 'Sustainable Energy Instagram', active: true }, 
        { id: 'srv-16', name: 'Test Drive Local Ads', active: true } 
      ], 
      active: true 
    }
  ]);
export 	let selectedProjectId = writable<String>("planetbun")

export let services = [

]

export let userEx = {
	id: "123",
	projects: [""]
}

