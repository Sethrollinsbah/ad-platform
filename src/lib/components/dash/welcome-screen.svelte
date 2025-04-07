<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	let animating = false;
	let clicking = false;
	let cursorVisible = false;

	let buttonRef: HTMLButtonElement;
	let firstNodeButton: HTMLButtonElement | null = null;
	let createButton: HTMLButtonElement | null = null;

	let startCoords = { x: 0, y: 0 };
	let delta = { x: 0, y: 0 };

	function handleCreateFirstNode() {
		animating = true;
		cursorVisible = true;

		setTimeout(() => {
			firstNodeButton = document.getElementById('create-first-node-button') as HTMLButtonElement;
			createButton = document.getElementById('create-button') as HTMLButtonElement;

			if (firstNodeButton && createButton) {
				const fromRect = createButton.getBoundingClientRect();
				const toRect = firstNodeButton.getBoundingClientRect();

				startCoords = {
					x: fromRect.left + fromRect.width / 2 - 24,
					y: fromRect.top + fromRect.height / 2 - 24
				};

				delta = {
					x: toRect.left - fromRect.left,
					y: toRect.top - fromRect.top
				};

				// Simulate click with animation after cursor reaches destination
				setTimeout(() => {
					clicking = true;

					// Actually trigger the create button click
					createButton?.click();

					// Fade out after click effect
					setTimeout(() => {
						clicking = false;
						cursorVisible = false;
						animating = false;
					}, 250);
				}, 500);
			}
		}, 50);
	}

	$: {
		firstNodeButton = document.getElementById('create-first-node-button') as HTMLButtonElement;
		createButton = document.getElementById('create-button') as HTMLButtonElement;
	}
</script>

<div class="flex h-full w-full items-center justify-center bg-gray-50 p-6">
	<div class="max-w-md text-center">
		<h1 class="mb-4 text-3xl font-bold text-gray-800">Welcome to Your Project</h1>
		<p class="mb-6 text-gray-600">
			It looks like this project is empty. Let's get started by creating your first node!
		</p>
		<button
			id="create-first-node-button"
			bind:this={buttonRef}
			on:click={handleCreateFirstNode}
			class="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			Create First Node
		</button>

		{#if animating && cursorVisible}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-mouse-pointer2-icon lucide-mouse-pointer-2 cursor-anim fixed z-50 h-10 w-10 fill-black text-black drop-shadow-lg
					{clicking ? ' cursor-clicking' : ''}
					{!cursorVisible ? ' cursor-hidden' : ''}"
				style="left: {startCoords.x}px; top: {startCoords.y}px;"
				transition:fly={{
					x: delta.x,
					y: delta.y,
					duration: 500,
					easing: quintOut
				}}
				><path
					d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
				/></svg
			>
		{/if}

		<div class="mt-6 text-sm text-gray-500">
			<p>Not sure where to start?</p>
			<a href="/help-center" class="text-blue-600 underline hover:text-blue-800">
				Check out our getting started guide
			</a>
		</div>
	</div>
</div>

<style>
	.cursor-anim {
		transition:
			transform 0.2s ease,
			opacity 0.3s ease;
	}
	.cursor-clicking {
		transform: scale(0.8);
	}
	.cursor-hidden {
		opacity: 0;
	}
</style>
