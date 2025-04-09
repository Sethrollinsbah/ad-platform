<script lang="ts">
	import { draggable } from '@neodrag/svelte';

	// Props
	let {
		id,
		position = { x: 0, y: 0 },
		onPositionChange = undefined,
		bounds = undefined,
		disabled = false,
		grid = undefined,
		axis = undefined,
		handle = undefined,
		children
	} = $props();

	// Options for useDraggable
	let options = {
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
	};
</script>

<div use:draggable={options} class="draggable-item" data-node-id={id}>
	<!-- <slot></slot> -->
	{@render children()}
</div>

<style>
	.draggable-item {
		position: absolute;
		user-select: none;
	}
</style>
