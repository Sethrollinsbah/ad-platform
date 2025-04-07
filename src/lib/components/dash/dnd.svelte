<!-- src/lib/components/dash/dnd.svelte -->
<script lang="ts">
	import { Background, Svelvet } from 'svelvet';
	import { onMount, onDestroy } from 'svelte';
	import ActivityPanel from './activity-panel.svelte';
	import CampaignPanel from './campaign-panel.svelte';
	import CreateButton from './create-button.svelte';
	import WelcomeScreen from './welcome-screen.svelte'; // New welcome screen component
	import { nodes, nodeDefinitions } from '@/lib/stores/node-store';
	import { registerComponents, setupProjectChangeListener } from '@/lib/init/project-node-init';
	import { projectId } from '@/lib';
	import { get } from 'svelte/store';

	// Use $state for reactive state in Svelte 5
	let loaded = $state(false);
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	let partialInnerHeight = $derived(innerHeight - 4 * 16);
	let unsubscribe = $state(null);
	let isLoading = $state(true);
	let hasNodes = $state(false); // New state to track if nodes exist

	// Add state to track the current project ID
	let currentProjectId = $state(get(projectId));

	// Function to fetch nodes from the database
	async function fetchNodesFromDatabase() {
		try {
			isLoading = true;
			// Clear existing nodes first
			nodeDefinitions.set([]);

			// Fetch nodes for the current project
			const response = await fetch(
				`/api/nodes/position?projectId=${encodeURIComponent(currentProjectId)}`
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch nodes: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();

			if (data.success && data.nodes) {
				// Add each node to the store
				data.nodes.forEach((node) => {
					const nodeData = {
						id: node.id,
						type: node.type,
						position: node.position,
						data: node.configuration
					};

					// Add to store
					nodeDefinitions.update((defs) => [...defs, nodeData]);
				});

				// Update hasNodes state
				hasNodes = data.nodes.length > 0;

				console.log(`Loaded ${data.nodes.length} nodes from database`);
			} else {
				// No nodes found
				hasNodes = false;
				console.log('No nodes found in database.');
			}

			isLoading = false;
		} catch (error) {
			console.error('Error fetching nodes:', error);
			// In case of error, set hasNodes to false
			hasNodes = false;
			isLoading = false;
		}
	}

	onMount(() => {
		// Register node components
		registerComponents();

		// Fetch nodes from database
		fetchNodesFromDatabase();

		// Set up listener for project changes
		unsubscribe = setupProjectChangeListener(fetchNodesFromDatabase);

		// Subscribe to project ID changes for UI updates
		const projectUnsubscribe = projectId.subscribe((newProjectId) => {
			currentProjectId = newProjectId;
			// Fetch nodes when project changes
			fetchNodesFromDatabase();
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
	async function handleNodeDragStop(event: CustomEvent) {
		const { id, position } = event.detail;
		// Update the node position in our store
		nodeDefinitions.update((defs) =>
			defs.map((node) => (node.id === id ? { ...node, position } : node))
		);

		// Save position to the database
		await saveNodePosition(id, position, currentProjectId);
	}

	// Function to save node positions
	async function saveNodePosition(
		nodeId: string,
		position: { x: number; y: number },
		projectId: string
	) {
		try {
			const response = await fetch('/api/nodes/position', {
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

			if (!response.ok) {
				console.error(`Failed to save node position: ${response.status} ${response.statusText}`);
			}
		} catch (error) {
			console.error('Failed to save node position:', error);
		}
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if loaded}
	{#if isLoading}
		<div class="flex h-full w-full items-center justify-center">
			<div class="text-center">
				<div
					class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"
				></div>
				<p class="text-gray-600">Loading data from database...</p>
			</div>
		</div>
	{:else if !hasNodes}
		<!-- Welcome screen when no nodes exist -->
		<WelcomeScreen  />
	{:else}
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
{/if}

<!-- Project indicator -->
<div
	class="absolute bottom-4 left-4 z-10 rounded-md bg-white bg-opacity-80 px-3 py-1 text-sm shadow-sm"
>
	Project: {currentProjectId}
</div>

<ActivityPanel></ActivityPanel>
<CampaignPanel></CampaignPanel>
<CreateButton></CreateButton>
