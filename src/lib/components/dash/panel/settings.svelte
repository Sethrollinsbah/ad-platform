<script lang="ts">
	import Button from '../../ui/button/button.svelte';
	import { settingsPanel } from '$lib';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Switch from '$lib/components/ui/switch';
	import {
		Calendar,
		Upload,
		Lock,
		Users,
		Clock,
		Bell,
		Link,
		Image,
		Cog,
		Target,
		DollarSign,
		Calendar as CalendarIcon,
		Settings,
		Tag,
		BarChart3,
		ThumbsUp,
		AlertCircle,
		Database,
		RefreshCw,
		Share2,
		ShieldAlert,
		Key,
		Trash2
	} from 'lucide-svelte';
	import * as Separator from '$lib/components/ui/separator';

	// Campaign settings state
	let campaignSettings = $state({
		name: 'Weekend Special Promotion',
		status: 'active',
		budget: 1200,
		startDate: '2025-03-01',
		endDate: '2025-04-15',
		dailyCap: 40,
		target: 'local_customers',
		notifications: true,
		automaticBidding: true
	});

	// Platform settings state
	let platformSettings = $state({
		name: 'Instagram',
		type: 'social',
		budget: 450,
		budgetPercentage: 35,
		adFormat: 'carousel',
		audience: 'food_enthusiasts',
		bidStrategy: 'automatic',
		dayparting: true,
		daypartingHours: [12, 13, 14, 17, 18, 19, 20, 21],
		tracking: true
	});

	// Table settings state
	let tableSettings = $state({
		name: 'Customers',
		description: 'Customer data for CRM and targeting',
		refreshFrequency: 'daily',
		autoSync: true,
		includeInReports: true,
		privacyLevel: 'restricted',
		backupEnabled: true,
		apiAccess: true
	});

	// Form handlers
	function handleCampaignSubmit() {
		// In a real app, this would save to the backend
		alert('Campaign settings updated!');
	}

	function handlePlatformSubmit() {
		// In a real app, this would save to the backend
		alert('Platform settings updated!');
	}

	function handleTableSubmit() {
		// In a real app, this would save to the backend
		alert('Table settings updated!');
	}

	function handleDeleteComponent() {
		if (confirm('Are you sure you want to delete this component? This action cannot be undone.')) {
			// In a real app, this would delete the component
			alert('Component deleted!');
			$settingsPanel = { id: null, type: null };
		}
	}

	// Helper for day-parting time selection
	function isTimeSelected(hour: number): boolean {
		return platformSettings.daypartingHours.includes(hour);
	}

	function toggleTimeSelection(hour: number) {
		if (isTimeSelected(hour)) {
			platformSettings.daypartingHours = platformSettings.daypartingHours.filter((h) => h !== hour);
		} else {
			platformSettings.daypartingHours = [...platformSettings.daypartingHours, hour].sort(
				(a, b) => a - b
			);
		}
	}

	// Get the time display for hour (24-hour to 12-hour conversion)
	function getTimeDisplay(hour: number): string {
		const period = hour >= 12 ? 'PM' : 'AM';
		const displayHour = hour % 12 === 0 ? 12 : hour % 12;
		return `${displayHour} ${period}`;
	}

	// Days of the week
	const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	// Campaign status options
	const statusOptions = [
		{ value: 'active', label: 'Active' },
		{ value: 'paused', label: 'Paused' },
		{ value: 'scheduled', label: 'Scheduled' },
		{ value: 'ended', label: 'Ended' }
	];

	// Platform types
	const platformTypes = [
		{ value: 'social', label: 'Social Media' },
		{ value: 'search', label: 'Search' },
		{ value: 'display', label: 'Display' },
		{ value: 'email', label: 'Email' },
		{ value: 'video', label: 'Video' }
	];

	// Ad formats by platform type
	const adFormats = {
		social: [
			{ value: 'carousel', label: 'Carousel Ads' },
			{ value: 'single_image', label: 'Single Image' },
			{ value: 'video', label: 'Video' },
			{ value: 'stories', label: 'Stories' },
			{ value: 'reels', label: 'Reels/Short Video' }
		],
		search: [
			{ value: 'text', label: 'Text Ads' },
			{ value: 'callout', label: 'Callout Extensions' },
			{ value: 'location', label: 'Location Extensions' },
			{ value: 'sitelink', label: 'Sitelink Extensions' }
		],
		display: [
			{ value: 'banner', label: 'Banner Ads' },
			{ value: 'responsive', label: 'Responsive Ads' },
			{ value: 'native', label: 'Native Ads' }
		],
		email: [
			{ value: 'newsletter', label: 'Newsletter' },
			{ value: 'promotion', label: 'Promotional Email' },
			{ value: 'abandoned_cart', label: 'Abandoned Cart' }
		],
		video: [
			{ value: 'instream', label: 'In-stream Ads' },
			{ value: 'discovery', label: 'Discovery Ads' },
			{ value: 'bumper', label: 'Bumper Ads' }
		]
	};

	// Audience options
	const audienceOptions = [
		{ value: 'food_enthusiasts', label: 'Food Enthusiasts' },
		{ value: 'local_residents', label: 'Local Residents' },
		{ value: 'office_workers', label: 'Office Workers' },
		{ value: 'families', label: 'Families' },
		{ value: 'nightlife', label: 'Nightlife & Entertainment' },
		{ value: 'health_conscious', label: 'Health Conscious Diners' }
	];

	// Table refresh frequency options
	const refreshOptions = [
		{ value: 'real_time', label: 'Real-time' },
		{ value: 'hourly', label: 'Hourly' },
		{ value: 'daily', label: 'Daily' },
		{ value: 'weekly', label: 'Weekly' },
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'manual', label: 'Manual Only' }
	];

	// Privacy levels
	const privacyLevels = [
		{ value: 'public', label: 'Public - All teams' },
		{ value: 'internal', label: 'Internal - Organization only' },
		{ value: 'restricted', label: 'Restricted - Marketing team only' },
		{ value: 'private', label: 'Private - Admins only' }
	];

	// Helper to format currency
	function formatCurrency(value: number): string {
		return value.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		});
	}
</script>

{#if $settingsPanel.type === 'campaign'}
	<div class="space-y-6 py-4">Load campaign settings data</div>
{:else if $settingsPanel.type === 'platform'}
	<form on:submit|preventDefault={handlePlatformSubmit} class="space-y-4">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<Cog class="h-5 w-5 text-gray-500" />
					Advanced Settings
				</Card.Title>
				<Card.Description>Configure advanced options for this platform.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="bid-strategy">Bidding Strategy</Label>
						<Select.Root value={platformSettings.bidStrategy}>
							<Select.Trigger id="bid-strategy" class="w-full">
								<Select.Value placeholder="Select bidding strategy" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="automatic">Automatic Bidding</Select.Item>
								<Select.Item value="manual">Manual CPC</Select.Item>
								<Select.Item value="target_cpa">Target CPA</Select.Item>
								<Select.Item value="target_roas">Target ROAS</Select.Item>
							</Select.Content>
						</Select.Root>
						<p class="text-xs text-gray-500">
							Determines how the platform will optimize your bids for ad placements.
						</p>
					</div>

					<div class="grid gap-2">
						<Label>Day Parting</Label>
						<div class="flex items-center">
							<Switch.Root id="dayparting-toggle" checked={platformSettings.dayparting}>
								<Switch.Thumb />
							</Switch.Root>
							<Label for="dayparting-toggle" class="ml-2">Enable day parting</Label>
						</div>

						{#if platformSettings.dayparting}
							<div class="mt-2">
								<p class="mb-2 text-xs text-gray-500">Select active hours for your ads:</p>
								<div class="grid grid-cols-6 gap-2">
									{#each Array.from({ length: 24 }, (_, i) => i) as hour}
										<button
											type="button"
											class={`h-8 rounded-md border text-xs ${
												isTimeSelected(hour)
													? 'bg-primary text-primary-foreground'
													: 'bg-background text-foreground'
											}`}
											on:click={() => toggleTimeSelection(hour)}
										>
											{getTimeDisplay(hour)}
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<div class="grid gap-2">
						<Label>Conversion Tracking</Label>
						<div class="flex items-center">
							<Switch.Root id="tracking-toggle" checked={platformSettings.tracking}>
								<Switch.Thumb />
							</Switch.Root>
							<Label for="tracking-toggle" class="ml-2">Enable conversion tracking</Label>
						</div>
						<p class="text-xs text-gray-500">
							Track actions like calls, website visits, and online orders from this platform.
						</p>
					</div>

					<Separator.Root class="my-2" />

					<div class="grid gap-2">
						<Label>Platform Integration</Label>
						<div class="rounded-md border border-gray-200 p-3">
							<div class="flex items-center justify-between">
								<div>
									<span class="font-medium">{platformSettings.name} Account</span>
									<p class="text-sm text-gray-500">Connected as: restaurant@example.com</p>
								</div>
								<Button variant="outline" size="sm">Reconnect</Button>
							</div>
						</div>
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button type="submit" variant="outline">Cancel</Button>
				<Button type="submit">Save Changes</Button>
			</Card.Footer>
		</Card.Root>
	</form>
{:else if $settingsPanel.type === 'table'}
	<form on:submit|preventDefault={handleTableSubmit} class="space-y-4">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<ShieldAlert class="h-5 w-5 text-gray-500" />
					Access & Security
				</Card.Title>
				<Card.Description>Manage access controls and security settings.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4">
					<!-- <div class="grid gap-2"> -->
					<!-- 	<Label for="privacy-level">Privacy Level</Label> -->
					<!-- 	<Select.Root value={tableSettings.privacyLevel}> -->
					<!-- 		<Select.Trigger id="privacy-level" class="w-full"> -->
					<!-- 			<Select.Value placeholder="Select privacy level" /> -->
					<!-- 		</Select.Trigger> -->
					<!-- 		<Select.Content> -->
					<!-- 			{#each privacyLevels as option} -->
					<!-- 				<Select.Item value={option.value}>{option.label}</Select.Item> -->
					<!-- 			{/each} -->
					<!-- 		</Select.Content> -->
					<!-- 	</Select.Root> -->
					<!-- 	<p class="text-xs text-gray-500"> -->
					<!-- 		Determines who can access and view this table. -->
					<!-- 	</p> -->
					<!-- </div> -->
					<!--  -->
					<!-- <div class="grid gap-2"> -->
					<!-- 	<Label>Data Backup</Label> -->
					<!-- 	<div class="flex items-center"> -->
					<!-- 		<Switch.Root id="backup-toggle" checked={tableSettings.backupEnabled}> -->
					<!-- 			<Switch.Thumb /> -->
					<!-- 		</Switch.Root> -->
					<!-- 		<Label for="backup-toggle" class="ml-2">Enable automated backups</Label> -->
					<!-- 	</div> -->
					<!-- 	<p class="text-xs text-gray-500"> -->
					<!-- 		Automatically back up this table on a weekly schedule. -->
					<!-- 	</p> -->
					<!-- </div> -->
					<!--  -->
					<!-- <div class="grid gap-2"> -->
					<!-- 	<Label>API Access</Label> -->
					<!-- 	<div class="flex items-center"> -->
					<!-- 		<Switch.Root id="api-toggle" checked={tableSettings.apiAccess}> -->
					<!-- 			<Switch.Thumb /> -->
					<!-- 		</Switch.Root> -->
					<!-- 		<Label for="api-toggle" class="ml-2">Enable API access</Label> -->
					<!-- 	</div> -->
					<!-- 	<p class="text-xs text-gray-500"> -->
					<!-- 		Allow this table to be accessed via API for integration with other systems. -->
					<!-- 	</p> -->
					<!-- </div> -->

					{#if tableSettings.apiAccess}
						<div class="grid gap-2">
							<Label>API Key</Label>
							<div class="flex items-center space-x-2">
								<Input value="sk_live_xxxxxxxxxxxxxxxxxxxx" type="password" readonly />
								<Button variant="outline" size="icon">
									<Key class="h-4 w-4" />
								</Button>
							</div>
							<p class="text-xs text-gray-500">
								Use this key to authenticate API requests for this table.
							</p>
						</div>
					{/if}

					<Separator.Root class="my-2" />

					<div class="grid gap-2">
						<Label>Data Management</Label>

						<Button variant="outline" class="flex w-full items-center justify-center">
							<RefreshCw class="mr-2 h-4 w-4" />
							Refresh Data Now
						</Button>

						<Button variant="outline" class="flex w-full items-center justify-center">
							<Share2 class="mr-2 h-4 w-4" />
							Export Table Data
						</Button>

						<Button variant="destructive" class="flex w-full items-center justify-center">
							<Trash2 class="mr-2 h-4 w-4" />
							Delete Table
						</Button>
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button type="submit" variant="outline">Cancel</Button>
				<Button type="submit">Save Changes</Button>
			</Card.Footer>
		</Card.Root>
	</form>
{/if}
