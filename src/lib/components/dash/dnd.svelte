<!-- // src/lib/components/dash/dnd.svelte -->

<script lang="ts">
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

	// Get project ID from the URL
	let currentProjectId = $derived($page.params.projectId || '');

	// Set up a container ref
	let container;
	let containerRect = { left: 0, top: 0 };

	// Update container dimensions when it mounts or resizes
	function updateContainerRect() {
		if (container) {
			const rect = container.getBoundingClientRect();
			containerRect = { left: rect.left, top: rect.top };
		}
	}

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
		updateNodePosition(id, position);

		// Send position update to the server
		fetch('/api/nodes/position', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nodeId: id,
				position,
				projectId: currentProjectId
			})
		}).catch((error) => {
			console.error('Error updating node position:', error);
		});
	}

	// Initialize
	onMount(() => {
		if (browser) {
			updateContainerRect();
			loadNodesFromDB();

			// Add window resize listener
			window.addEventListener('resize', updateContainerRect);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', updateContainerRect);
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
				<svelte:component this={getComponentForType(node.type)} nodeId={node.id} data={node.data} />
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

<!---->
<!-- <ActivityPanel></ActivityPanel> -->
<!-- <CampaignPanel></CampaignPanel> -->
<!-- <CreateButton></CreateButton> -->

<style>
	.dashboard-container {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: auto;
		background-color: #f9fafb;
		background-image:
			linear-gradient(to right, #e5e7eb 1px, transparent 1px),
			linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
		background-size: 20px 20px;
	}
</style>
