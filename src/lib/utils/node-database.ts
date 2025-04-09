// src/lib/utils/node-database.ts

import type { Node } from '$lib/types/node-types';

/**
 * Save a node's configuration to the database
 * @param nodeId The unique identifier of the node
 * @param nodeType The type of node (campaign, platform, table)
 * @param position The x,y coordinates of the node
 * @param configuration The node's configuration data
 * @param projectId The current project ID
 * @returns Promise<boolean> Success status
 */
export async function saveNodeToDatabase(
  nodeId: string, 
  nodeType: string, 
  position: { x: number, y: number }, 
  configuration: any,
  projectId: string
): Promise<boolean> {
  try {
    // Validate inputs
    if (!nodeId || !nodeType || !position || !configuration || !projectId) {
      console.error('Missing required parameters for saving node to database');
      return false;
    }
    
    console.log(`Saving node ${nodeId} to database for project ${projectId}`);
    
    // Use the nodes/configuration endpoint to save the node
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
        projectId
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to save node: ${response.status} ${response.statusText}`, errorText);
      return false;
    }

    const data = await response.json();
    
    // Initialize the database for the new project if needed
    if (data.success) {
      // Optionally set up initial project data if this is the first node
      await fetch(`/api/db/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId
        })
      });
    }
    
    return data.success;
  } catch (error) {
    console.error('Error saving node to database:', error);
    return false;
  }
}

/**
 * Load nodes from the database for a specific project
 * @param projectId The project ID
 * @returns Promise<Node[]> Array of node data
 */
export async function loadNodesFromDatabase(projectId: string): Promise<Omit<Node, 'component'>[]> {
  try {
    if (!projectId) {
      console.error('No project ID provided');
      return [];
    }
    
    // Fetch nodes from the positions API
    const response = await fetch(`/api/nodes/position?projectId=${encodeURIComponent(projectId)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch nodes: ${response.status} ${response.statusText}`, errorText);
      return [];
    }
    
    const data = await response.json();
    
    if (data.success && data.nodes) {
      // Transform the nodes into the correct format
      return data.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.configuration
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error loading nodes from database:', error);
    return [];
  }
}
