<script lang="ts">
	import { settingsPanel } from '$lib';

	// Customizable properties using Svelte 5's $props()
	let {
		id = 'films',
		positionX = $bindable(1090),
		positionY = 150,
		headingText = 'Films',
		headingColor = '#FF5252',
		borderColor = '#000000',
		tableData = [
			// { field: 'id', type: 'bigint', constraint: 'autoincrement()' },
		],
		cellWidth = 70,
		cellPadding = 10,
		backgroundColor = '#FFFFFF',
		shadowColor = '#000000',
		schema,
		data = {
			schema: [] // Provide a default empty array
		}
	} = $props();

	// Ensure data and schema exist

	// Local state using $state
	let isHovered = $state(false);
	// Add these variables to track drag state
	let isDragging = $state(false);
	let dragStartX = $state(0);
	let dragStartY = $state(0);
	const dragThreshold = 5; // Pixels of movement needed to consider it a drag

	function handleClick() {
		if (!isDragging) {
			settingsPanel.set({ id, type: 'table', data });
		}
	}
</script>

<div
	class="nodeWrapper"
	style="
		background-color: {backgroundColor}; 
		border: 3px solid {borderColor};
		box-shadow: {isHovered ? '8px 8px 0px' : '6px 6px 0px'} {shadowColor};
	"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	onclick={handleClick}
>
	<div id="container">
		<div
			class="heading"
			style="
				background-color: {headingColor}; 
				border-bottom: 3px solid {borderColor};
			"
		>
			{headingText || positionX}
		</div>

		{#if schema && schema.length > 0}
			<table id="{id}Table" class="db-table">
				<tbody>
					{#each schema as row}
						<tr>
							<td
								style="
									width: {cellWidth}px; 
									padding: {cellPadding}px; 
									border-right: 2px solid {borderColor}; 
									border-bottom: 2px solid {borderColor};
									font-family: 'Courier New', monospace;
									font-weight: bold;
								"
							>
								{row.field || ''}
							</td>
							<td
								style="
									width: {cellWidth}px; 
									padding: {cellPadding}px; 
									border-right: 2px solid {borderColor}; 
									border-bottom: 2px solid {borderColor};
									font-family: 'Courier New', monospace;
								"
							>
								{row.type || ''}
							</td>
							<td
								style="
									width: {cellWidth}px; 
									padding: {cellPadding}px; 
									border-bottom: 2px solid {borderColor};
									font-family: 'Courier New', monospace;
									font-style: italic;
								"
							>
								{row.constraint || ''}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<div class="p-4 text-center text-gray-500">No schema data available</div>
		{/if}
	</div>
</div>

<style>
	.nodeWrapper {
		box-sizing: border-box;
		width: fit-content;
		border-radius: 0px;
		height: fit-content;
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 0px;
		transition:
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.nodeWrapper:hover {
		transform: translate(-2px, -2px);
	}

	.heading {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 12px;
		font-size: 22px;
		font-weight: 900;
		font-family: Arial, sans-serif;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: #000000;
	}

	.db-table {
		border-collapse: collapse;
		width: 100%;
	}

	.db-table td {
		transition: background-color 0.2s ease;
	}

	.db-table tr:hover td {
		background-color: #f3f3f3;
	}
</style>
