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
export function addNode(node: Omit<Node, 'component'>): void {
  nodeDefinitions.update(nodes => [...nodes, node]);
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
