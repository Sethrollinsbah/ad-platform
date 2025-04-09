<script lang="ts">
  import { panzoom } from 'svelte-pan-zoom';
	import { onMount, onDestroy } from 'svelte';
	import { nodeDefinitions, updateNodePosition } from '$lib/stores/node-store';
	import { page } from '$app/stores';
	import { projectId } from '$lib';

	// Import your node components here
	import CampaignNode from '@/lib/components/svelvet/nodes/campaign-node.svelte';
	import PlatformNode from '@/lib/components/svelvet/nodes/platform-node.svelte';
	import TableNode from '@/lib/components/svelvet/nodes/table-node.svelte';
	import Draggable from '@/lib/components/draggable.svelte';
	import { browser } from '$app/environment';
	import ActivityPanel from './activity-panel.svelte';
	import CampaignPanel from './campaign-panel.svelte';
	import CreateButton from './create-button.svelte';

	// Get project ID from the URL
	let currentProjectId = $derived($page.params.projectId || '');

	// Set up a container ref
	let container;

	// Load nodes from the database
	async function loadNodesFromDB() {
		try {
			const response = await fetch(
				`/api/nodes/position?projectId=${encodeURIComponent(currentProjectId)}`
			);
			const data = await response.json();

			if (data.success && data.nodes) {
				// Clear existing nodes
				nodeDefinitions.set([]);

				// Add nodes from the database
				data.nodes.forEach((node) => {
					nodeDefinitions.update((nodes) => [
						...nodes,
						{
							id: node.id,
							type: node.type,
							position: node.position,
							data: node.configuration
						}
					]);
				});
			}
		} catch (error) {
			console.error('Error loading nodes:', error);
		}
	}

	// Handle position updates
	function handlePositionChange(id, position) {
		// Update the node position in the store
		updateNodePosition(id, position, currentProjectId);
	}

	// Initialize
	onMount(() => {
		if (browser) {
			loadNodesFromDB();
		}
	});

	// Get component based on node type
	function getComponentForType(type) {
		switch (type) {
			case 'campaign':
				return CampaignNode;
			case 'platform':
				return PlatformNode;
			case 'table':
				return TableNode;
			default:
				return null;
		}
	}
</script>

<div class="dashboard-container" bind:this={container}>
	{#each $nodeDefinitions as node (node.id)}
		{#if getComponentForType(node.type)}
			<Draggable
				id={node.id}
				position={node.position}
				onPositionChange={handlePositionChange}
				bounds="parent"
			>
				<svelte:component this={getComponentForType(node.type)} id={node.id} {...node.data} />
			</Draggable>
		{/if}
	{/each}
</div>

<!-- Project indicator -->
<div
	class="absolute bottom-4 left-4 z-10 rounded-md bg-white bg-opacity-80 px-3 py-1 text-sm shadow-sm"
>
	Project: {$page.params.projectId}
</div>

<ActivityPanel></ActivityPanel>
<CampaignPanel></CampaignPanel>
<CreateButton></CreateButton>

<style>
	.dashboard-container {
		position: relative;
		width: 100%;
		height: calc(100vh - 4rem); /* Adjusts height by subtracting 16rem from the viewport height */
		overflow: auto;
		background-color: #f9fafb;
		background-image:
			linear-gradient(to right, #e5e7eb 1px, transparent 1px),
			linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
		background-size: 20px 20px;
		overscroll-behavior: contain; /* Prevents navigation gestures */
		/* Hide scrollbar for WebKit browsers */
		&::-webkit-scrollbar {
			display: none;
		}

		/* Hide scrollbar for Firefox */
		scrollbar-width: none;

		/* Hide scrollbar for IE and Edge */
		-ms-overflow-style: none;
	}
</style>
