<script lang="ts">
	import { settingsPanel } from '@/lib';
	import { Node, Anchor } from 'svelvet';

	// Customizable properties using Svelte 5's $props()
	let {
		id = 'platform-1',
		positionX = 800,
		positionY = 300,
		platformName = 'Instagram',
		platformType = 'Social', // Options: "Social", "Search", "Display", "Email"
		platformIcon = '📱', // Emoji icon representation
		budget = 450,
		budgetPercentage = 35, // Percentage of total campaign budget
		impressions = 22500,
		clicks = 1125,
		conversions = 90,
		costPerClick = 0.4,
		costPerConversion = 5.0,
		mainColor = '#E1306C', // Instagram pink color
		borderColor = '#000000',
		shadowColor = '#F5A3C7',
		backgroundColor = '#FFFFFF',
		anchorDirection = 'west',
		anchorTop = 70,
		anchorLeft = -16
	} = $props();

	// Local state using $state
	let isHovered = $state(false);

	// Calculate metrics
	const ctr = ((clicks / impressions) * 100).toFixed(1);
	const convRate = ((conversions / clicks) * 100).toFixed(1);

	// Platform color mapping
	const platformColors = {
		Instagram: '#E1306C',
		Facebook: '#1877F2',
		Google: '#4285F4',
		TikTok: '#000000',
		Twitter: '#1DA1F2',
		LinkedIn: '#0A66C2',
		YouTube: '#FF0000',
		Pinterest: '#E60023',
		Email: '#D54B3D',
		Display: '#34A853'
	};

	// Platform icons mapping
	const platformIcons = {
		Instagram: '📸',
		Facebook: '👥',
		Google: '🔍',
		TikTok: '🎵',
		Twitter: '🐦',
		LinkedIn: '💼',
		YouTube: '▶️',
		Pinterest: '📌',
		Email: '📧',
		Display: '🖼️'
	};

	// Platform type badges
	const platformTypeColors = {
		Social: '#FF5252',
		Search: '#FBBC05',
		Display: '#34A853',
		Email: '#4285F4',
		Video: '#FF0000'
	};

	// Get platform color if not set
	$effect(() => {
		if (!mainColor && platformColors[platformName]) {
			mainColor = platformColors[platformName];
		}

		if (!platformIcon && platformIcons[platformName]) {
			platformIcon = platformIcons[platformName];
		}
	});

	// Format numbers
	function formatNumber(num: number): string {
		return num.toLocaleString();
	}
	let isDragging = $state(false);
	let dragStartX = $state(0);
	let dragStartY = $state(0);
	const dragThreshold = 5; // Pixels of movement needed to consider it a drag
</script>

<Node useDefaults {id} position={{ x: positionX, y: positionY }}>
	<div
		role="tooltip"
		class="platform-node"
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
				settingsPanel.set({ id, type: 'platform' });
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
				settingsPanel.set({ id, type: 'platform' });
			}
		}}
	>
		<!-- Header -->
		<div
			class="platform-header"
			style="background-color: {mainColor}; border-bottom: 4px solid {borderColor};"
		>
			<div class="platform-icon">{platformIcon}</div>
			<div class="platform-title">{platformName}</div>
			<div
				class="platform-type"
				style="background-color: {platformTypeColors[
					platformType
				]}; border: 3px solid {borderColor};"
			>
				{platformType}
			</div>
		</div>

		<!-- Budget Section -->
		<div class="platform-section">
			<div class="section-label">CHANNEL BUDGET</div>
			<div class="budget-row">
				<div class="budget-value">${budget}</div>
				<div class="budget-percentage">{budgetPercentage}%</div>
			</div>

			<!-- Budget Bar -->
			<div class="budget-bar-container">
				<div
					class="budget-bar-fill"
					style="width: {budgetPercentage}%; background-color: {mainColor};"
				></div>
			</div>
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
				<div class="metric-label">CONV.</div>
			</div>
			<div class="metric-item">
				<div class="metric-value">${costPerClick}</div>
				<div class="metric-label">CPC</div>
			</div>
			<div class="metric-item">
				<div class="metric-value">${costPerConversion}</div>
				<div class="metric-label">CPA</div>
			</div>
		</div>

		<!-- Channel Strengths -->
		<div class="channel-strengths">
			<div class="strengths-label">CHANNEL STRENGTHS</div>
			<div class="strengths-tags">
				<div class="strength-tag">Visual Impact</div>
				<div class="strength-tag">Brand Awareness</div>
				<div class="strength-tag">Engagement</div>
			</div>
		</div>
	</div>
</Node>

<style>
	.platform-node {
		box-sizing: border-box;
		width: 300px;
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

	.platform-node:hover {
		transform: translate(-2px, -2px);
	}

	.anchor-point {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 10px;
		z-index: 10;
	}

	.platform-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px;
	}

	.platform-icon {
		font-size: 24px;
		margin-right: 10px;
	}

	.platform-title {
		font-size: 20px;
		font-weight: 900;
		font-family: Arial, sans-serif;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: #000000;
		flex-grow: 1;
	}

	.platform-type {
		font-size: 12px;
		font-weight: 800;
		padding: 3px 8px;
		color: #000000;
		text-transform: uppercase;
	}

	.platform-section {
		padding: 14px;
		border-bottom: 3px solid #000000;
	}

	.section-label,
	.strengths-label {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 1px;
		margin-bottom: 6px;
		color: #555555;
	}

	.budget-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 8px;
	}

	.budget-value {
		font-size: 22px;
		font-weight: 900;
		font-family: 'Courier New', monospace;
	}

	.budget-percentage {
		font-size: 16px;
		font-weight: 800;
		font-family: 'Courier New', monospace;
	}

	.budget-bar-container {
		height: 16px;
		background-color: #eeeeee;
		border: 2px solid #000000;
	}

	.budget-bar-fill {
		height: 100%;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 3px;
		padding: 10px;
		border-bottom: 3px solid #000000;
	}

	.metric-item {
		padding: 10px;
		text-align: center;
		border: 2px solid #000000;
		margin: 2px;
	}

	.metric-value {
		font-size: 16px;
		font-weight: 800;
		font-family: 'Courier New', monospace;
	}

	.metric-label {
		font-size: 10px;
		font-weight: 700;
		margin-top: 4px;
		color: #555555;
		letter-spacing: 0.5px;
	}

	.channel-strengths {
		padding: 14px;
	}

	.strengths-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.strength-tag {
		font-size: 11px;
		font-weight: 700;
		background-color: #eeeeee;
		border: 2px solid #000000;
		padding: 4px 8px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
</style>
