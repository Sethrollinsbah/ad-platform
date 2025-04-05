// src/lib/registry/node-registry.ts

import type { SvelteComponent } from 'svelte';
import type { Node } from '$lib/types/node-types';

// Component registry map
const componentRegistry: Map<string, typeof SvelteComponent> = new Map();

/**
 * Register a component for a specific node type
 * @param type The node type
 * @param component The Svelte component
 */
export function registerNodeComponent(type: string, component: typeof SvelteComponent): void {
  componentRegistry.set(type, component);
}

/**
 * Get the component for a specific node type
 * @param type The node type
 * @returns The Svelte component or undefined if not registered
 */
export function getNodeComponent(type: string): typeof SvelteComponent | undefined {
  return componentRegistry.get(type);
}

/**
 * Check if a component is registered for a specific node type
 * @param type The node type
 * @returns True if the component is registered
 */
export function hasNodeComponent(type: string): boolean {
  return componentRegistry.has(type);
}

/**
 * Create a node with the registered component
 * @param node The node definition
 * @returns The node with the component attached
 */
export function createNode<T extends Node>(nodeData: Omit<T, 'component'>): T | null {
  const component = getNodeComponent(nodeData.type);
  
  if (!component) {
    console.error(`No component registered for node type: ${nodeData.type}`);
    return null;
  }

  return {
    ...nodeData,
    component
  } as T;
}
