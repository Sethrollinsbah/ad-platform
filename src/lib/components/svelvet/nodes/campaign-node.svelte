<script lang="ts">
	import { settingsPanel } from '$lib';
	import { Node, Anchor } from 'svelvet';

	// Customizable properties using Svelte 5's $props()
	let {
		id = 'campaign-1',
		positionX = 500,
		positionY = 300,
		campaignName = 'Weekend Special',
		campaignStatus = 'Active', // Options: "Active", "Paused", "Completed"
		budget = 1200,
		impressions = 45000,
		clicks = 2250,
		conversions = 180,
		startDate = '2025-03-15',
		endDate = '2025-04-15',
		mainColor = '#FF5252',
		borderColor = '#000000',
		shadowColor = '#FF9999',
		anchorDirection = 'west',
		anchorTop = 70,
		anchorLeft = -16,
		backgroundColor = '#FFFFFF'
	} = $props();

	// Local state using $state
	let isHovered = $state(false);

	// Calculate metrics
	const ctr = ((clicks / impressions) * 100).toFixed(1);
	const convRate = ((conversions / clicks) * 100).toFixed(1);
	const cpc = (budget / clicks).toFixed(2);

	// Format numbers
	function formatNumber(num: number): string {
		return num.toLocaleString();
	}

	// Status color mapping
	const statusColors = {
		Active: '#34A853',
		Paused: '#FBBC05',
		Completed: '#4285F4',
		Scheduled: '#9C27B0'
	};

	// Get status color
	const getStatusColor = (status: string) => {
		return statusColors[status] || mainColor;
	};
	let isDragging = $state(false);
	let dragStartX = $state(0);
	let dragStartY = $state(0);
	const dragThreshold = 5; // Pixels of movement needed to consider it a drag
</script>

<Node useDefaults {id} position={{ x: positionX, y: positionY }}>
	<div
		role="button"
		class="campaign-node"
		style="
            background-color: {backgroundColor}; 
            border: 4px solid {borderColor};
            box-shadow: {isHovered ? '10px 10px 0px' : '8px 8px 0px'} {shadowColor};
        "
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
		onmousedown={(e) => {
			isDragging = false;
			dragStartX = e.clientX;
			dragStartY = e.clientY;
		}}
		onmousemove={(e) => {
			// Calculate distance moved
			const dx = Math.abs(e.clientX - dragStartX);
			const dy = Math.abs(e.clientY - dragStartY);

			// If moved more than threshold, consider it a drag
			if (dx > dragThreshold || dy > dragThreshold) {
				isDragging = true;
			}
		}}
		onmouseup={(e) => {
			// Only open settings panel if not dragging
			if (!isDragging) {
				settingsPanel.set({ id, type: 'campaign' });
			}
		}}
		ontouchstart={(e) => {
			isDragging = false;
			dragStartX = e.touches[0].clientX;
			dragStartY = e.touches[0].clientY;
		}}
		ontouchmove={(e) => {
			const dx = Math.abs(e.touches[0].clientX - dragStartX);
			const dy = Math.abs(e.touches[0].clientY - dragStartY);
			if (dx > dragThreshold || dy > dragThreshold) {
				isDragging = true;
			}
		}}
		ontouchend={(e) => {
			if (!isDragging) {
				settingsPanel.set({ id, type: 'campaign' });
			}
		}}
	>
		<!-- Header -->
		<div
			class="campaign-header"
			style="background-color: {mainColor}; border-bottom: 4px solid {borderColor};"
		>
			<div class="campaign-title">{campaignName}</div>
			<div
				class="campaign-status"
				style="background-color: {getStatusColor(campaignStatus)}; border: 3px solid {borderColor};"
			>
				{campaignStatus}
			</div>
		</div>

		<!-- Budget Section -->
		<div class="campaign-section">
			<div class="section-label">BUDGET</div>
			<div class="budget-value">${budget}</div>
			<div class="date-range">{startDate} to {endDate}</div>
		</div>

		<!-- Metrics Grid -->
		<div class="metrics-grid">
			<div class="metric-item">
				<div class="metric-value">{formatNumber(impressions)}</div>
				<div class="metric-label">IMPRESSIONS</div>
			</div>
			<div class="metric-item">
				<div class="metric-value">{formatNumber(clicks)}</div>
				<div class="metric-label">CLICKS</div>
			</div>
			<div class="metric-item">
				<div class="metric-value">{ctr}%</div>
				<div class="metric-label">CTR</div>
			</div>
			<div class="metric-item">
				<div class="metric-value">{formatNumber(conversions)}</div>
				<div class="metric-label">CONVERSIONS</div>
			</div>
			<div class="metric-item">
				<div class="metric-value">{convRate}%</div>
				<div class="metric-label">CONV. RATE</div>
			</div>
			<div class="metric-item">
				<div class="metric-value">${cpc}</div>
				<div class="metric-label">CPC</div>
			</div>
		</div>
	</div>
</Node>

<style>
	.campaign-node {
		box-sizing: border-box;
		width: 320px;
		border-radius: 0px;
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 0px;
		transition:
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.campaign-node:hover {
		transform: translate(-2px, -2px);
	}

	.anchor-point {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 10px;
		z-index: 10;
	}

	.campaign-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;
	}

	.campaign-title {
		font-size: 20px;
		font-weight: 900;
		font-family: Arial, sans-serif;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: #000000;
		max-width: 200px;
	}

	.campaign-status {
		font-size: 14px;
		font-weight: 800;
		padding: 4px 10px;
		color: #000000;
		text-transform: uppercase;
	}

	.campaign-section {
		padding: 14px;
		border-bottom: 3px solid #000000;
	}

	.section-label {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 1px;
		margin-bottom: 4px;
		color: #555555;
	}

	.budget-value {
		font-size: 24px;
		font-weight: 900;
		font-family: 'Courier New', monospace;
	}

	.date-range {
		font-size: 12px;
		margin-top: 4px;
		font-family: 'Courier New', monospace;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 3px;
		padding: 10px;
	}

	.metric-item {
		padding: 10px;
		text-align: center;
		border: 2px solid #000000;
		margin: 2px;
	}

	.metric-value {
		font-size: 18px;
		font-weight: 800;
		font-family: 'Courier New', monospace;
	}

	.metric-label {
		font-size: 11px;
		font-weight: 700;
		margin-top: 4px;
		color: #555555;
		letter-spacing: 0.5px;
	}
</style>
