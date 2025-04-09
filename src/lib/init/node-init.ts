// Import necessary dependencies and data
import { projectId, projects } from '@/lib';
import { registerNodeComponent } from '$lib/registry/node-registry';
import { addNode } from '$lib/stores/node-store';
import { get } from 'svelte/store'; // Add this import to get the get() function
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

