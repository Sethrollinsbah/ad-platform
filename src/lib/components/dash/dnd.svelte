<!-- src/lib/components/dash/dnd.svelte -->
<script lang="ts">
	import { Background, Svelvet } from 'svelvet';
	import { onMount } from 'svelte';
	import ActivityPanel from './activity-panel.svelte';
	import CampaignPanel from './campaign-panel.svelte';
	import CreateButton from './create-button.svelte';
	import { nodes, nodeDefinitions } from '@/lib/stores/node-store';
	import { initializeNodes } from '@/lib/init/node-init';

	// Use $state to make these reactive
	let loaded = $state(false);
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	let partialInnerHeight = $derived(innerHeight - 4 * 16);

	onMount(() => {
		// Initialize the nodes
		initializeNodes();

		// Set a small timeout to ensure the DOM is fully ready
		setTimeout(() => {
			loaded = true;
		}, 100);
	});

	// Handle node position updates
	function handleNodeDragStop(event: CustomEvent) {
		const { id, position } = event.detail;
		// Update the node position in our store
		nodeDefinitions.update((defs) =>
			defs.map((node) => (node.id === id ? { ...node, position } : node))
		);
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

<ActivityPanel></ActivityPanel>
<CampaignPanel></CampaignPanel>
<CreateButton></CreateButton>
