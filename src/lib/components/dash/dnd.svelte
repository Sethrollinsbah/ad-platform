<!-- src/lib/components/dash/dnd.svelte -->
<script lang="ts">
	import { Background, Svelvet } from 'svelvet';
	import { onMount, onDestroy } from 'svelte';
	import ActivityPanel from './activity-panel.svelte';
	import CampaignPanel from './campaign-panel.svelte';
	import CreateButton from './create-button.svelte';
	import { nodes, nodeDefinitions } from '@/lib/stores/node-store';
	import { 
		registerComponents, 
		initializeProjectNodes, 
		setupProjectChangeListener 
	} from '@/lib/init/project-node-init';
	import { projectId } from '@/lib';
	import { get } from 'svelte/store';

	// Use $state to make these reactive
	let loaded = $state(false);
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	let partialInnerHeight = $derived(innerHeight - 4 * 16);
	let unsubscribe: (() => void) | null = $state(null);

	// Add state to track the current project ID
	let currentProjectId = $state(get(projectId));

	onMount(() => {
		// Register node components
		registerComponents();
		
		// Initialize nodes for the current project
		initializeProjectNodes();
		
		// Set up listener for project changes
		unsubscribe = setupProjectChangeListener();
		
		// Subscribe to project ID changes for UI updates
		const projectUnsubscribe = projectId.subscribe(newProjectId => {
			currentProjectId = newProjectId;
		});
		
		// Set a small timeout to ensure the DOM is fully ready
		setTimeout(() => {
			loaded = true;
		}, 100);
		
		// Return cleanup function
		return () => {
			if (unsubscribe) unsubscribe();
			projectUnsubscribe();
		};
	});
	
	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});

	// Handle node position updates
	function handleNodeDragStop(event: CustomEvent) {
		const { id, position } = event.detail;
		// Update the node position in our store
		nodeDefinitions.update((defs) =>
			defs.map((node) => (node.id === id ? { ...node, position } : node))
		);
		
		// In a real app, you would also save this to the database
		// saveNodePosition(id, position, currentProjectId);
	}
	
	// Add a helper function to save node positions
	async function saveNodePosition(nodeId: string, position: { x: number, y: number }, projectId: string) {
		try {
			await fetch('/api/nodes/position', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nodeId,
					position,
					projectId
				})
			});
		} catch (error) {
			console.error('Failed to save node position:', error);
		}
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if loaded}
	<Svelvet
		width={innerWidth}
		height={partialInnerHeight}
		fitView
		controls
		minimap
		on:nodeDragStop={handleNodeDragStop}
	>
		{#each $nodes as node}
			<svelte:component
				this={node.component}
				{...node.data}
				data={node.data}
				position={node.position}
				id={node.id}
			/>
		{/each}
		<Background slot="background" dotSize={2} dotColor="black" />
	</Svelvet>
{/if}

<!-- Project indicator -->
<div class="absolute bottom-4 left-4 z-10 rounded-md bg-white bg-opacity-80 px-3 py-1 text-sm shadow-sm">
	Project: {currentProjectId}
</div>

<ActivityPanel></ActivityPanel>
<CampaignPanel></CampaignPanel>
<CreateButton></CreateButton>
