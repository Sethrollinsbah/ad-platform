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

<form on:submit|preventDefault={handleCampaignSubmit} class="space-y-4">
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<CalendarIcon class="h-5 w-5 text-gray-500" />
				Campaign Schedule
			</Card.Title>
			<Card.Description>Set the timeline for your campaign.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label for="start-date">Start Date</Label>
						<Input id="start-date" type="date" bind:value={campaignSettings.startDate} required />
					</div>

					<div class="grid gap-2">
						<Label for="end-date">End Date</Label>
						<Input id="end-date" type="date" bind:value={campaignSettings.endDate} required />
					</div>
				</div>

				<div class="grid gap-2">
					<Label>Active Days</Label>
					<div class="flex flex-wrap gap-2">
						{#each daysOfWeek as day}
							<Button
								variant={['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day) ? 'default' : 'outline'}
								class="h-10 flex-1"
							>
								{day}
							</Button>
						{/each}
					</div>
				</div>

				<div class="grid gap-2">
					<Label>Day Parting</Label>
					<p class="mb-2 text-xs text-gray-500">Select active hours for your campaign:</p>
					<div class="grid grid-cols-6 gap-2">
						{#each Array.from({ length: 24 }, (_, i) => i) as hour}
							<button
								type="button"
								class={`h-8 rounded-md border text-xs ${
									[11, 12, 13, 17, 18, 19, 20].includes(hour)
										? 'bg-primary text-primary-foreground'
										: 'bg-background text-foreground'
								}`}
							>
								{getTimeDisplay(hour)}
							</button>
						{/each}
					</div>
					<p class="mt-2 text-xs text-gray-600">
						Showing active hours in restaurant's local timezone (EDT).
					</p>
				</div>
			</div>
		</Card.Content>
		<Card.Footer class="flex justify-between">
			<Button type="submit" variant="outline">Cancel</Button>
			<Button type="submit">Save Changes</Button>
		</Card.Footer>
	</Card.Root>
</form>
