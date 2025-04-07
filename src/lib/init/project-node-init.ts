// src/lib/init/project-node-init.ts
import { get } from 'svelte/store';
import { projectId, projects } from '@/lib';
import { registerNodeComponent } from '$lib/registry/node-registry';
import { addNode, removeNode } from '$lib/stores/node-store';
import type { TableNode, CampaignNode, PlatformNode } from '$lib/types/node-types';

// Import the components
import DbTable from '$lib/components/svelvet/nodes/db-table.svelte';
import CampaignNode from '$lib/components/svelvet/nodes/campaign-node.svelte';
import PlatformNode from '$lib/components/svelvet/nodes/platform-node.svelte';

// Define project-specific node configuration types
type NodeConfiguration = {
  [projectId: string]: {
    tables: Omit<TableNode, 'component'>[];
    campaigns: Omit<CampaignNode, 'component'>[];
    platforms: Omit<PlatformNode, 'component'>[];
  }
};

// Sample project-specific node configurations
const projectConfigurations: NodeConfiguration = {
  'nike-sportswear': {
    tables: [
      {
        id: 'customers-nike',
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
            { field: 'sportswear_preferences', type: 'varchar', constraint: '' },
            { field: 'created_at', type: 'timestamp', constraint: 'not null' },
            { field: 'last_purchase', type: 'timestamp', constraint: '' }
          ],
          schema: [
            { field: 'id', type: 'bigint', constraint: 'autoincrement()' },
            { field: 'name', type: 'varchar', constraint: 'not null' },
            { field: 'email', type: 'varchar', constraint: 'not null' },
            { field: 'sportswear_preferences', type: 'varchar', constraint: '' },
            { field: 'created_at', type: 'timestamp', constraint: 'not null' },
            { field: 'last_purchase', type: 'timestamp', constraint: '' }
          ]
        }
      }
    ],
    campaigns: [
      {
        id: 'summer-collection',
        type: 'campaign',
        position: { x: 100, y: 100 },
        data: {
          campaignName: 'Summer Collection',
          campaignStatus: 'Active',
          budget: 2500,
          impressions: 85000,
          clicks: 4200,
          conversions: 320,
          startDate: '2025-04-01',
          endDate: '2025-06-15',
          mainColor: '#FF5252',
          shadowColor: '#FF9999'
        }
      }
    ],
    platforms: [
      {
        id: 'instagram-nike',
        type: 'platform',
        position: { x: 500, y: 100 },
        data: {
          platformName: 'Instagram',
          platformType: 'Social',
          platformIcon: '📸',
          budget: 750,
          budgetPercentage: 30,
          impressions: 42500,
          clicks: 2100,
          conversions: 160,
          costPerClick: 0.36,
          costPerConversion: 4.7,
          mainColor: '#E1306C',
          shadowColor: '#F5A3C7'
        }
      }
    ]
  },
  'starbucks-seasonal': {
    tables: [
      {
        id: 'customers-starbucks',
        type: 'table',
        position: { x: -300, y: -300 },
        data: {
          headingText: 'Customers',
          headingColor: '#006241', // Starbucks green
          borderColor: '#000000',
          shadowColor: '#8FC7B5',
          tableData: [
            { field: 'id', type: 'bigint', constraint: 'autoincrement()' },
            { field: 'name', type: 'varchar', constraint: 'not null' },
            { field: 'email', type: 'varchar', constraint: 'not null' },
            { field: 'favorite_drink', type: 'varchar', constraint: '' },
            { field: 'loyalty_level', type: 'varchar', constraint: '' },
            { field: 'created_at', type: 'timestamp', constraint: 'not null' },
            { field: 'last_purchase', type: 'timestamp', constraint: '' }
          ],
          schema: [
            { field: 'id', type: 'bigint', constraint: 'autoincrement()' },
            { field: 'name', type: 'varchar', constraint: 'not null' },
            { field: 'email', type: 'varchar', constraint: 'not null' },
            { field: 'favorite_drink', type: 'varchar', constraint: '' },
            { field: 'loyalty_level', type: 'varchar', constraint: '' },
            { field: 'created_at', type: 'timestamp', constraint: 'not null' },
            { field: 'last_purchase', type: 'timestamp', constraint: '' }
          ]
        }
      }
    ],
    campaigns: [
      {
        id: 'spring-drinks',
        type: 'campaign',
        position: { x: 100, y: 100 },
        data: {
          campaignName: 'Spring Drinks Promotion',
          campaignStatus: 'Active',
          budget: 1800,
          impressions: 62000,
          clicks: 3100,
          conversions: 240,
          startDate: '2025-03-15',
          endDate: '2025-05-15',
          mainColor: '#006241', // Starbucks green
          shadowColor: '#8FC7B5'
        }
      }
    ],
    platforms: [
      {
        id: 'facebook-starbucks',
        type: 'platform',
        position: { x: 500, y: 100 },
        data: {
          platformName: 'Facebook',
          platformType: 'Social',
          platformIcon: '👥',
          budget: 630,
          budgetPercentage: 35,
          impressions: 32000,
          clicks: 1600,
          conversions: 125,
          costPerClick: 0.39,
          costPerConversion: 5.04,
          mainColor: '#1877F2',
          shadowColor: '#8BB9FE'
        }
      }
    ]
  },
  // Default configuration for restaurants
  'planetbun': {
    tables: [
      {
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
      }
    ],
    campaigns: [
      {
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
      },
      {
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
      }
    ],
    platforms: [
      {
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
      },
      {
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
      }
    ]
  }
};

/**
 * Register all node components
 */
export function registerComponents(): void {
  registerNodeComponent('table', DbTable);
  registerNodeComponent('campaign', CampaignNode);
  registerNodeComponent('platform', PlatformNode);
}

/**
 * Clear all existing nodes
 * This should be called before initializing project-specific nodes
 */
export function clearAllNodes(): void {
  // This would require getting all existing node IDs and removing them
  // For simplicity in this example, we'll assume this is handled elsewhere
  // In a real implementation, you'd need to get all current nodes and remove them
}

/**
 * Initialize nodes based on the current project
 */
export async function initializeProjectNodes(): Promise<void> {
  // Get current project ID
  const currentProjectId = get(projectId);
  
  try {
    // First try to load nodes from the database
    const dbNodes = await loadNodesFromDatabase(currentProjectId);
    
    if (dbNodes && dbNodes.length > 0) {
      console.log(`Loaded ${dbNodes.length} nodes from database for project ${currentProjectId}`);
      
      // Add nodes from database
      dbNodes.forEach(node => {
        addNode(node);
      });
      
      return;
    }
  } catch (error) {
    console.error(`Error loading nodes from database for project ${currentProjectId}:`, error);
    // Continue with local configuration as fallback
  }
  
  // If we reach here, either there was an error or no nodes were found in the database
  // Fall back to the hardcoded configuration
  console.log(`Using local configuration for project ${currentProjectId}`);
  
  // Look up the configuration for this project
  let config = projectConfigurations[currentProjectId];
  
  // If no configuration found for this project, use default
  if (!config) {
    console.warn(`No node configuration found for project ${currentProjectId}, using default`);
    config = projectConfigurations['planetbun']; // Default fallback
  }
  
  // Add tables
  config.tables.forEach(table => addNode(table));
  
  // Add campaigns
  config.campaigns.forEach(campaign => addNode(campaign));
  
  // Add platforms
  config.platforms.forEach(platform => addNode(platform));
  
  console.log(`Initialized nodes for project: ${currentProjectId}`);
}

/**
 * Load node configurations from database for a specific project
 */
async function loadNodesFromDatabase(projectId: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/nodes/position?projectId=${encodeURIComponent(projectId)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load nodes: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }
    
    // Map the database nodes to the format expected by addNode
    return data.nodes.map((node: any) => {
      // Base node structure
      const nodeData: any = {
        id: node.id,
        type: node.type,
        position: node.position
      };
      
      // Add type-specific data
      switch (node.type) {
        case 'table':
          return {
            ...nodeData,
            data: {
              ...node.configuration,
              headingText: node.configuration.headingText || 'Table',
              headingColor: node.configuration.headingColor || '#4285F4',
              borderColor: node.configuration.borderColor || '#000000',
              shadowColor: node.configuration.shadowColor || '#99C9FF',
              tableData: node.configuration.tableData || [],
              schema: node.configuration.schema || []
            }
          };
          
        case 'campaign':
          return {
            ...nodeData,
            data: {
              ...node.configuration,
              campaignName: node.configuration.campaignName || 'Campaign',
              campaignStatus: node.configuration.campaignStatus || 'Draft',
              budget: node.configuration.budget || 1000,
              impressions: node.configuration.impressions || 0,
              clicks: node.configuration.clicks || 0,
              conversions: node.configuration.conversions || 0,
              startDate: node.configuration.startDate || new Date().toISOString().split('T')[0],
              endDate: node.configuration.endDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
              mainColor: node.configuration.mainColor || '#FF5252',
              shadowColor: node.configuration.shadowColor || '#FF9999'
            }
          };
          
        case 'platform':
          return {
            ...nodeData,
            data: {
              ...node.configuration,
              platformName: node.configuration.platformName || 'Platform',
              platformType: node.configuration.platformType || 'Social',
              platformIcon: node.configuration.platformIcon || '📱',
              budget: node.configuration.budget || 0,
              budgetPercentage: node.configuration.budgetPercentage || 0,
              impressions: node.configuration.impressions || 0,
              clicks: node.configuration.clicks || 0,
              conversions: node.configuration.conversions || 0,
              costPerClick: node.configuration.costPerClick || 0,
              costPerConversion: node.configuration.costPerConversion || 0,
              mainColor: node.configuration.mainColor || '#E1306C',
              shadowColor: node.configuration.shadowColor || '#F5A3C7'
            }
          };
          
        default:
          return nodeData;
      }
    });
  } catch (error) {
    console.error('Error loading nodes from database:', error);
    return [];
  }
}

/**
 * Subscribe to project changes and update nodes when project changes
 */
export function setupProjectChangeListener(): () => void {
  const unsubscribe = projectId.subscribe(newProjectId => {
    if (newProjectId) {
      // Clear existing nodes and initialize for the new project
      clearAllNodes();
      initializeProjectNodes();
    }
  });
  
  // Return the unsubscribe function for cleanup
  return unsubscribe;
}

/**
 * Save a node's configuration to the database
 */
export async function saveNodeConfiguration(
  nodeId: string, 
  nodeType: string, 
  position: { x: number, y: number }, 
  configuration: any
): Promise<boolean> {
  try {
    const currentProjectId = get(projectId);
    
    const response = await fetch('/api/nodes/configuration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nodeId,
        nodeType,
        position,
        configuration,
        projectId: currentProjectId
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save node configuration: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving node configuration:', error);
    return false;
  }
}

/**
 * Initialize everything
 */
export function initializeNodes(): void {
  registerComponents();
  initializeProjectNodes();
}
