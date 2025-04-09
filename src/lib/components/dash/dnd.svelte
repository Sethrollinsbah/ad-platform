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
	import { page } from '$app/stores';

	// Use $state for reactive state in Svelte 5
	let loaded = $state(false);
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	let partialInnerHeight = $derived(innerHeight - 4 * 16);
	let unsubscribe = $state(null);
	let isLoading = $state(true);
	let hasNodes = $state(false); // New state to track if nodes exist

	// Add state to track the current project ID
	// let currentProjectId = $state(get(projectId));

	// Function to fetch nodes from the database
	async function fetchNodesFromDatabase() {
		try {
			isLoading = true;
			// Clear existing nodes first
			nodeDefinitions.set([]);

			// Fetch nodes for the current project
			const response = await fetch(
				`/api/nodes/position?projectId=${encodeURIComponent($page.params.projectId)}`
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

	onMount(async () => {
		// Register node components
		registerComponents();

		// Fetch nodes from database
		await fetchNodesFromDatabase();
		// Set a small timeout to ensure the DOM is fully ready
		setTimeout(() => {
			loaded = true;
		}, 100);
	});

	// Handle node position updates
	async function handleNodeDragStop(event: CustomEvent) {
		const { id, position } = event.detail;
		console.log('CONSOLE: ' + event.detail);
		// Update the node position in our store
		nodeDefinitions.update((defs) =>
			defs.map((node) => (node.id === id ? { ...node, position } : node))
		);

		// Save position to the database
		await saveNodePosition(id, position, $page.params.projectId);
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
	let socket: WebSocket | null = $state(null);

	onMount(() => {
		// Connect to your WebSocket server
		socket = new WebSocket(`ws://[::]:3041/ws?filename=${$page.params.projectId}`);

		// When the connection opens
		socket.addEventListener('open', () => {
			console.log('🔌 WebSocket connected');
		});

		// Handle incoming messages
		socket.addEventListener('message', (event) => {
			try {
				const msg = JSON.parse(event.data);
				console.log('📨 WebSocket message:', msg.event);

				// Example: reload nodes when update event is received
				if (msg.event === 'node_config_change') {
					fetchNodesFromDatabase();
				}
			} catch (err) {
				console.error('❌ Failed to parse WebSocket message:', err);
			}
		});

		// Handle errors
		socket.addEventListener('error', (event) => {
			console.error('WebSocket error:', event);
		});

		// Handle disconnect
		socket.addEventListener('close', () => {
			console.warn('🛑 WebSocket disconnected');
		});

		return () => {
			// Clean up when component unmounts
			if (socket) {
				socket.close();
			}
		};
	});

	onDestroy(() => {
		if (socket) {
			socket.close();
		}
	});
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
		<WelcomeScreen />
	{:else}
		<Svelvet
			width={innerWidth}
			height={partialInnerHeight}
			fitView
			controls
			minimap
			on:nodeDragStop={handleNodeDragStop}
			on:handleNodeDragStop
		>
			{#each $nodes as node, i}
				<svelte:component
					this={node.component}
					{...node.data}
					data={node.data}
					positionX={node.position.x}
					positionY={node.position.y}
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
	Project: {$page.params.projectId}
</div>

<ActivityPanel></ActivityPanel>
<CampaignPanel></CampaignPanel>
<CreateButton></CreateButton>
