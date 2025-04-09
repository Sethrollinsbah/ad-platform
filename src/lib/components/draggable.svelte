<!-- // Step 1: Install neodrag -->
<!-- // Run this command in your project directory: -->
<!-- // npm install @neodrag/svelte -->
<!---->
<!-- // Step 2: Create a draggable component wrapper -->
<!-- // src/lib/components/draggable.svelte -->

<script lang="ts">
	import { createDraggable } from '@neodrag/svelte';

	// Props
	let {
		id,
		position = { x: 0, y: 0 },
		onPositionChange = undefined,
		bounds = undefined,
		disabled = false,
		grid = undefined,
		axis = undefined,
		handle = undefined
	} = $props();

	// State
	let element;

	// Use neodrag
	const draggable = createDraggable({
		position,
		onDrag: (event) => {
			if (onPositionChange) {
				onPositionChange(id, event.position);
			}
		},
		bounds,
		disabled,
		grid,
		axis,
		handle
	});
</script>

<div bind:this={element} use:draggable class="draggable-item" data-node-id={id}>
	<slot></slot>
</div>

<!-- // Step 6: Update package.json to include neodrag dependency -->
<!---->
<!-- // In your package.json, add "@neodrag/svelte" to dependencies: -->
<!-- // "dependencies": { -->
<!-- //   "@neodrag/svelte": "^2.0.3", -->
<!-- //   ...other dependencies -->
<!-- // } -->

<style>
	.draggable-item {
		position: absolute;
		user-select: none;
	}
</style>
