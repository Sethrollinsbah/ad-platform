// Import necessary dependencies and data
import { projectId, projects } from '@/lib';
import { registerNodeComponent } from '$lib/registry/node-registry';
import { addNode } from '$lib/stores/node-store';
import type { TableNode, CampaignNode, PlatformNode } from '$lib/types/node-types';

// Import the components
import DbTable from '$lib/components/svelvet/nodes/db-table.svelte';
import CampaignNode from '$lib/components/svelvet/nodes/campaign-node.svelte';
import PlatformNode from '$lib/components/svelvet/nodes/platform-node.svelte';

/**
 * Register all node components
 */
export function registerComponents(): void {
  registerNodeComponent('table', DbTable);
  registerNodeComponent('campaign', CampaignNode);
  registerNodeComponent('platform', PlatformNode);
}

/**
 * Initialize the default nodes based on project data from the store
 */
export function initializeDefaultNodes(): void {
  // Get current project ID and corresponding project data
  const currentProjectId = get(projectId);
  const projectsData = get(projects);
  const currentProject = projectsData.find(p => p.id === currentProjectId) || projectsData[0];
  
  // Table nodes - use selected project's database table
  const customersTable: Omit<TableNode, 'component'> = {
    id: 'customers',
    type: 'table',
    position: { x: -300, y: -300 },
    data: {
      headingText: 'Customers',
      headingColor: '#4285F4',
      borderColor: '#000000',
      shadowColor: '#99C9FF',
      tableData: [
        { field: 'id', type: 'bigint', constraint: 'autoincrement()' },
        { field: 'name', type: 'varchar', constraint: 'not null' },
        { field: 'email', type: 'varchar', constraint: 'not null' },
        { field: 'phone', type: 'varchar', constraint: '' },
        { field: 'created_at', type: 'timestamp', constraint: 'not null' },
        { field: 'last_order', type: 'timestamp', constraint: '' }
      ],
      schema: [
        { field: 'id', type: 'bigint', constraint: 'autoincrement()' },
        { field: 'name', type: 'varchar', constraint: 'not null' },
        { field: 'email', type: 'varchar', constraint: 'not null' },
        { field: 'phone', type: 'varchar', constraint: '' },
        { field: 'created_at', type: 'timestamp', constraint: 'not null' },
        { field: 'last_order', type: 'timestamp', constraint: '' }
      ]
    }
  };
  
  // Campaign nodes - use data from the current project if available
  const weekendSpecial: Omit<CampaignNode, 'component'> = {
    id: 'weekend-special',
    type: 'campaign',
    position: { x: 100, y: 100 },
    data: {
      campaignName: 'Weekend Special',
      campaignStatus: 'Active',
      budget: 1200,
      impressions: 45000,
      clicks: 2250,
      conversions: 180,
      startDate: '2025-03-15',
      endDate: '2025-04-15',
      mainColor: '#FF5252',
      shadowColor: '#FF9999'
    }
  };
  
  const happyHourPromo: Omit<CampaignNode, 'component'> = {
    id: 'happy-hour',
    type: 'campaign',
    position: { x: 100, y: 300 },
    data: {
      campaignName: 'Happy Hour Promo',
      campaignStatus: 'Scheduled',
      budget: 800,
      impressions: 18000,
      clicks: 950,
      conversions: 85,
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      mainColor: '#FBBC05',
      shadowColor: '#FFDE99'
    }
  };
  
  // Platform nodes - common marketing platforms for restaurants
  const instagramChannel: Omit<PlatformNode, 'component'> = {
    id: 'instagram-channel',
    type: 'platform',
    position: { x: 500, y: 100 },
    data: {
      platformName: 'Instagram',
      platformType: 'Social',
      platformIcon: '📸',
      budget: 450,
      budgetPercentage: 35,
      impressions: 22500,
      clicks: 1125,
      conversions: 90,
      costPerClick: 0.4,
      costPerConversion: 5.0,
      mainColor: '#E1306C',
      shadowColor: '#F5A3C7'
    }
  };
  
  const googleSearch: Omit<PlatformNode, 'component'> = {
    id: 'google-search',
    type: 'platform',
    position: { x: 500, y: 300 },
    data: {
      platformName: 'Google',
      platformType: 'Search',
      platformIcon: '🔍',
      budget: 350,
      budgetPercentage: 27,
      impressions: 10200,
      clicks: 765,
      conversions: 45,
      costPerClick: 0.46,
      costPerConversion: 7.78,
      mainColor: '#4285F4',
      shadowColor: '#A4C2F4'
    }
  };
  
  const facebookChannel: Omit<PlatformNode, 'component'> = {
    id: 'facebook-channel',
    type: 'platform',
    position: { x: 500, y: 500 },
    data: {
      platformName: 'Facebook',
      platformType: 'Social',
      platformIcon: '👥',
      budget: 300,
      budgetPercentage: 23,
      impressions: 18500,
      clicks: 925,
      conversions: 37,
      costPerClick: 0.32,
      costPerConversion: 8.11,
      mainColor: '#1877F2',
      shadowColor: '#8BB9FE'
    }
  };
  
  // Add all nodes to the store
  addNode(customersTable);
  addNode(weekendSpecial);
  addNode(happyHourPromo);
  addNode(instagramChannel);
  addNode(googleSearch);
  addNode(facebookChannel);
}

/**
 * Initialize everything
 */
export function initializeNodes(): void {
  registerComponents();
  initializeDefaultNodes();
}
