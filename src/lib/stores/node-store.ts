// src/lib/stores/node-store.ts

import { writable, derived } from 'svelte/store';
import type { Node } from '$lib/types/node-types';
import { createNode } from '$lib/registry/node-registry';

// The store for all nodes
export const nodeDefinitions = writable<Omit<Node, 'component'>[]>([]);

// Derived store that creates nodes with their components attached
export const nodes = derived(nodeDefinitions, (defs) => {
  return defs
    .map(def => createNode(def))
    .filter((node): node is Node => node !== null);
});

/**
 * Add a new node to the store
 * @param node The node definition without the component
 */
export function addNode(node: Omit<Node, 'component'>, currentProjectId: string): void {
  fetch(`/api/nodes/position?projectId=${encodeURIComponent(currentProjectId)}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const existingNodes = data.nodes || [];
        const nodeWidth = 360;
        const spacing = 50;

        let newPosition = { x: 100, y: 100 };

        if (existingNodes.length > 0) {
          // 1. Find average X to identify the "center-most" node
          const avgX = existingNodes.reduce((sum, n) => sum + n.position.x, 0) / existingNodes.length;

          // 2. Find the node closest to center X
          const centerNode = existingNodes.reduce((closest, current) => {
            const currentDist = Math.abs(current.position.x - avgX);
            const closestDist = Math.abs(closest.position.x - avgX);
            return currentDist < closestDist ? current : closest;
          }, existingNodes[0]);

          const targetY = centerNode.position.y;
          let targetX = centerNode.position.x + nodeWidth + spacing;

          // 3. Ensure no overlap at target position
          const isOverlapping = (x: number) => {
            return existingNodes.some(n => {
              const deltaX = Math.abs(n.position.x - x);
              return deltaX < nodeWidth && n.position.y === targetY;
            });
          };

          while (isOverlapping(targetX)) {
            targetX += nodeWidth + spacing; // move further right if overlap
          }

          newPosition = { x: targetX, y: targetY };
        }

        node.position = newPosition;

        // Update store
        nodeDefinitions.update(nodes => [...nodes, node]);

        // Save to database
        fetch('/api/nodes/configuration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nodeId: node.id,
            nodeType: node.type,
            position: node.position,
            configuration: node.data,
            projectId: currentProjectId
          })
        }).catch(error => console.error('Error saving node:', error));
      }
    })
    .catch(error => {
      console.error('Error fetching nodes:', error);
      nodeDefinitions.update(nodes => [...nodes, node]);
    });
}



/**
 * Remove a node from the store
 * @param id The ID of the node to remove
 */
export function removeNode(id: string): void {
  nodeDefinitions.update(nodes => nodes.filter(node => node.id !== id));
}

/**
 * Update a node in the store
 * @param id The ID of the node to update
 * @param updates The updates to apply to the node
 */
export function updateNode(id: string, updates: Partial<Omit<Node, 'id' | 'component'>>): void {
  nodeDefinitions.update(nodes => nodes.map(node => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    return node;
  }));
}

/**
 * Update a node's position
 * @param id The ID of the node to update
 * @param position The new position
 */
export function updateNodePosition(id: string, position: { x: number; y: number }): void {
  nodeDefinitions.update(nodes => nodes.map(node => {
    if (node.id === id) {
        let updatedNode: Node | undefined;

  // Update the store optimistically
  nodeDefinitions.update(nodes =>
    nodes.map(node => {
      if (node.id === id) {
        updatedNode = { ...node, ...updates };
        return updatedNode;
      }
      return node;
    })
  );

  // Send update to backend if position was updated
  if (updatedNode?.position) {
    return fetch('/api/nodes/position', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nodeId: updatedNode.id,
        position: updatedNode.position,
        projectId
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to update position: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Optionally handle the response data
        // console.log('Position updated:', data);
      })
      .catch(error => {
        console.error('Error updating node position:', error);
      });
  }

      return { ...node, position };
    }
    return node;
  }));
}

/**
 * Get a node by ID
 * @param id The ID of the node to get
 * @returns The node if found, or undefined if not found
 */
export function getNode(id: string): Omit<Node, 'component'> | undefined {
  let result: Omit<Node, 'component'> | undefined;
  
  nodeDefinitions.subscribe(nodes => {
    result = nodes.find(node => node.id === id);
  })();
  
  return result;
}
