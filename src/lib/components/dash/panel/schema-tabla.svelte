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

<form on:submit|preventDefault={handleTableSubmit} class="space-y-4">
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<Database class="h-5 w-5 text-gray-500" />
				Table Schema
			</Card.Title>
			<Card.Description>View and modify the table structure.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="overflow-x-auto rounded-md border border-gray-200">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Field
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Type
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Constraint
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							<!-- {#each tableData.schema as column, i} -->
							<!-- 	<tr> -->
							<!-- 		<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"> -->
							<!-- 			{column.name} -->
							<!-- 		</td> -->
							<!-- 		<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500"> -->
							<!-- 			{column.type} -->
							<!-- 		</td> -->
							<!-- 		<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500"> -->
							<!-- 			{column.constraint} -->
							<!-- 		</td> -->
							<!-- 		<td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"> -->
							<!-- 			<Button variant="ghost" size="sm" class="text-blue-600 hover:text-blue-900"> -->
							<!-- 				Edit -->
							<!-- 			</Button> -->
							<!-- 		</td> -->
							<!-- 	</tr> -->
							<!-- {/each} -->
						</tbody>
					</table>
				</div>

				<Button variant="outline" class="flex w-full items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-2 h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Add New Field
				</Button>

				<div class="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
					<div class="flex items-center">
						<AlertCircle class="mr-2 h-4 w-4" />
						<span class="font-medium">Schema Change Warning</span>
					</div>
					<p class="mt-1">
						Changes to the table schema may affect existing campaigns and analytics. We recommend
						testing schema changes in a development environment first.
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
