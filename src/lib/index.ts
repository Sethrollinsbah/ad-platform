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

// Project ID store - used throughout the application to identify the current project
export let projectId = writable<String>("");
export let selectedProjectId = writable<String>("");

// Empty projects store - this is no longer used as we're loading from the database
// but kept for backward compatibility
export let projects = writable<{id: string, name: String}[]>([]);

// Services store - for future implementation
export let services = writable([]);

// User info - for future implementation
export let userEx = {
	id: "123",
	projects: [""]
};
