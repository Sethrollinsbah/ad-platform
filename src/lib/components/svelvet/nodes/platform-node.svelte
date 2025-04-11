<script lang="ts">
	import { settingsPanel } from '@/lib';

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
		data = {}, // Add default empty object
		auth = {
					refreshToken: null,
					accessToken: null,
					expiryDate: null,
					userId: null,
				}
	} = $props();

	// Local state using $state
	let isHovered = $state(false);

	// Calculate metrics
	const ctr = ((clicks / impressions) * 100).toFixed(1);

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

	// Click handler
	function handleClick() {
		if (!auth.refreshToken) return;
		settingsPanel.set({ id, type: 'platform' });
	}
</script>

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
	onclick={handleClick}
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
			style="background-color: {platformTypeColors[platformType] ||
				'#CCCCCC'}; border: 3px solid {borderColor};"
		>
			{platformType}
		</div>
	</div>

{#if auth.refreshToken}
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
  
  <!-- Channel Strengths -->
  <div class="channel-strengths">
    <div class="strengths-label">CHANNEL STRENGTHS</div>
    <div class="strengths-tags">
      <div class="strength-tag">Visual Impact</div>
      <div class="strength-tag">Brand Awareness</div>
      <div class="strength-tag">Engagement</div>
    </div>
  </div>
{:else}
  <!-- Login Section -->
  <div class="login-container">
    <div class="login-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
        <polyline points="10 17 15 12 10 7"></polyline>
        <line x1="15" y1="12" x2="3" y2="12"></line>
      </svg>
    </div>
    <div class="login-message">Connect your {platformName} ads account to unlock channel analytics</div>
    <a 
      class="login-button" 
      style="background-color: {mainColor}; border: 3px solid {borderColor};"
      	href="/auth/google/login"
    >
      CONNECT ACCOUNT
    </a>
  </div>
{/if}
</div>

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
	.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  text-align: center;
  min-height: 180px;
}

.login-icon {
  margin-bottom: 16px;
  color: #555555;
}

.login-message {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.4;
  color: #333333;
}

.login-button {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #000000;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.1s ease;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.8);
}

.login-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.8);
}

.login-button:active {
  transform: translate(1px, 1px);
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.8);
}
</style>
