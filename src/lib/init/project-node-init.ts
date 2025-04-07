// src/lib/init/project-node-init.ts
import { projectId } from '@/lib';
import { registerNodeComponent } from '$lib/registry/node-registry';
import { addNode, removeNode } from '$lib/stores/node-store';
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
 * Subscribe to project changes and update nodes when project changes
 */
export function setupProjectChangeListener(onProjectChange: () => void): () => void {
  const unsubscribe = projectId.subscribe(newProjectId => {
    if (newProjectId) {
      // Call the callback function when project changes
      onProjectChange();
    }
  });
  
  // Return the unsubscribe function
  // // src/lib/init/project-node-init.ts (continued)
  
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
  configuration: any,
  currentProjectId: string
): Promise<boolean> {
  try {
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
