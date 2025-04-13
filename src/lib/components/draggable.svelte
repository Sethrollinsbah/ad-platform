<script lang="ts">
	import { page } from '$app/stores';
	import { draggable } from '@neodrag/svelte';
	import { updateNodePosition } from '../stores/node-store';

	// Props
	let {
		id,
		position = { x: 0, y: 0 },
		calculateBoundaries = undefined,
		scale,
		panX,
		panY,
		bounds = undefined,
		disabled = false,
		grid = undefined,
		axis = undefined,
		handle = undefined,
		children
	} = $props();
	function handlePositionChange(id, position) {
		// For draggable nodes, we need to apply the inverse of the transform
		// to get the real position in the un-transformed space
		const realPosition = {
			x: (position.x - panX) / scale,
			y: (position.y - panY) / scale
		};

		const change = updateNodePosition(id, realPosition, $page.params.projectId);
		console.log('change: ' + change);

		// Update boundaries (defer to next tick to ensure state is updated)
		setTimeout(calculateBoundaries, 100);
	}
	// Options for useDraggable
	let options = {
		defaultPosition: position,
		onDragEnd: (event) => {
			console.log(event);
			const pos = { x: event.offsetX, y: event.offsetY };
			handlePositionChange(id, pos);
			return;
		},
		bounds,
		disabled,
		grid,
		axis,
		handle
	};
</script>

<div use:draggable={options} class="draggable-item z-0 hover:z-50 focus:z-50" data-node-id={id}>
	<!-- <slot></slot> -->
	{@render children()}
</div>

<style>
	.draggable-item {
		position: absolute;
		user-select: none;
	}
</style>
