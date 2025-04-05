<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { addNode } from '$lib/stores/node-store';
	import type { TableNode, CampaignNode, PlatformNode } from '$lib/types/node-types';

	// Import our new components
	import TriggerButton from './create-button/trigger-button.svelte';
	import TypeSelection from './create-button/type-selection.svelte';
	import CampaignType from './create-button/campaign-type.svelte';
	import PlatformType from './create-button/platform-type.svelte';
	import TableType from './create-button/table-type.svelte';
	import DialogFooter from './create-button/dialog-footer.svelte';

	// State for active tab
	let activeTab = $state('home');
	// State for the dialog
	let isDialogOpen = $state(false);

	// Function to create a new table
	function createNewTable(tableType: string) {
		const schema: Record<string, any> = {
			customers: {
				headingText: 'Customers',
				headingColor: '#4285F4',
				schema: [
					{ field: 'id', type: 'bigint', constraint: 'autoincrement()' },
					{ field: 'name', type: 'varchar', constraint: 'not null' },
					{ field: 'email', type: 'varchar', constraint: 'not null' },
					{ field: 'phone', type: 'varchar', constraint: '' },
					{ field: 'created_at', type: 'timestamp', constraint: 'not null' },
					{ field: 'last_order', type: 'timestamp', constraint: '' }
				]
			}
			// ... other schema definitions
		};

		const tableConfig = schema[tableType] || {
			headingText: 'New Table',
			headingColor: '#4285F4',
			schema: [
				{ field: 'id', type: 'bigint', constraint: 'autoincrement()' },
				{ field: 'name', type: 'varchar', constraint: 'not null' },
				{ field: 'created_at', type: 'timestamp', constraint: 'not null' }
			]
		};

		const newTable: Omit<TableNode, 'component'> = {
			id: `table-${tableType}-${Date.now()}`,
			type: 'table',
			position: { x: 100, y: 100 },
			data: {
				...tableConfig,
				borderColor: '#000000',
				shadowColor: '#99C9FF'
			}
		};

		addNode(newTable);
		isDialogOpen = false;
	}

	// Function to create a new campaign
	function createNewCampaign(campaignType: string) {
		const campaignData: Record<string, any> = {
			'weekend-special': {
				campaignName: 'Weekend Special',
				campaignStatus: 'Active',
				budget: 1200,
				mainColor: '#FF5252',
				shadowColor: '#FF9999'
			}
			// ... other campaign definitions
		};

		const campaignConfig = campaignData[campaignType] || {
			campaignName: 'New Campaign',
			campaignStatus: 'Scheduled',
			budget: 1000,
			mainColor: '#FF5252',
			shadowColor: '#FF9999'
		};

		// Calculate dates
		const today = new Date();
		const startDate = new Date(today);
		startDate.setDate(today.getDate() + 7); // Start in a week

		const endDate = new Date(startDate);
		endDate.setDate(startDate.getDate() + 30); // Run for 30 days

		const newCampaign: Omit<CampaignNode, 'component'> = {
			id: `campaign-${campaignType}-${Date.now()}`,
			type: 'campaign',
			position: { x: 100, y: 100 },
			data: {
				...campaignConfig,
				impressions: 0,
				clicks: 0,
				conversions: 0,
				startDate: startDate.toISOString().split('T')[0],
				endDate: endDate.toISOString().split('T')[0]
			}
		};

		addNode(newCampaign);
		isDialogOpen = false;
	}

	// Function to create a new platform
	function createNewPlatform(platformType: string) {
		const platformData: Record<string, any> = {
			'google-ads': {
				platformName: 'Google',
				platformType: 'Search',
				platformIcon: '🔍',
				budget: 500,
				budgetPercentage: 30,
				mainColor: '#4285F4',
				shadowColor: '#A4C2F4'
			}
			// ... other platform definitions
		};

		const platformConfig = platformData[platformType] || {
			platformName: 'New Platform',
			platformType: 'Other',
			platformIcon: '📱',
			budget: 200,
			budgetPercentage: 15,
			mainColor: '#A4A4A4',
			shadowColor: '#D4D4D4'
		};

		const newPlatform: Omit<PlatformNode, 'component'> = {
			id: `platform-${platformType}-${Date.now()}`,
			type: 'platform',
			position: { x: 100, y: 100 },
			data: {
				...platformConfig,
				impressions: 0,
				clicks: 0,
				conversions: 0,
				costPerClick: 0.5,
				costPerConversion: 10.0
			}
		};

		addNode(newPlatform);
		isDialogOpen = false;
	}

	// Handle trigger button click
	function handleTriggerClick() {
		activeTab = 'home';
		isDialogOpen = true;
	}

	// Handle type selection
	function handleTypeSelect(type: string) {
		activeTab = type;
	}

	// Handle going back to home
	function handleBack() {
		activeTab = 'home';
	}

	// Handle dialog close
	function handleDialogClose() {
		isDialogOpen = false;
	}
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<TriggerButton onClick={handleTriggerClick} />

	<Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Create New Item</Dialog.Title>
			<Dialog.Description>
				Choose what kind of item you want to create for your restaurant marketing dashboard.
			</Dialog.Description>
		</Dialog.Header>

		<Tabs.Root value={activeTab} class="h-full w-full" on:change={(e) => (activeTab = e.detail)}>
			<!-- Type Selection (Home) -->
			{#if activeTab === 'home'}
				<TypeSelection onSelect={handleTypeSelect} />
			{/if}

			<!-- Campaign Options -->
			<Tabs.Content value="campaign">
				<CampaignType onBack={handleBack} onSelect={createNewCampaign} />
			</Tabs.Content>

			<!-- Platform Options -->
			<Tabs.Content value="platform">
				<PlatformType onBack={handleBack} onSelect={createNewPlatform} />
			</Tabs.Content>

			<!-- Table Options -->
			<Tabs.Content value="table">
				<TableType onBack={handleBack} onSelect={createNewTable} />
			</Tabs.Content>
		</Tabs.Root>

		<Dialog.Footer>
			<DialogFooter onCancel={handleDialogClose} />
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
