<script lang="ts">
	import Button from '../../ui/button/button.svelte';
	import { settingsPanel } from '$lib';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Upload, Image, Tag } from 'lucide-svelte';
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
</script>

<form on:submit|preventDefault={handlePlatformSubmit} class="space-y-4">
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<Image class="h-5 w-5 text-gray-500" />
				Creative Assets
			</Card.Title>
			<Card.Description>Configure the ads that will run on this platform.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="ad-format">Ad Format</Label>
					<Select.Root value={platformSettings.adFormat}>
						<Select.Trigger id="ad-format" class="w-full">
							<Select.Value placeholder="Select an ad format" />
						</Select.Trigger>
						<Select.Content>
							{#each adFormats[platformSettings.type] || [] as option}
								<Select.Item value={option.value}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid gap-2">
					<Label>Upload Creative Assets</Label>
					<div class="grid grid-cols-2 gap-4">
						<div class="rounded-md border border-dashed border-gray-300 p-6 text-center">
							<Upload class="mx-auto h-8 w-8 text-gray-400" />
							<p class="mt-2 text-sm text-gray-500">Upload Images</p>
							<p class="text-xs text-gray-400">PNG, JPG or WEBP (max. 5MB)</p>
							<Button variant="outline" class="mt-4">Browse Files</Button>
						</div>

						<div class="rounded-md border border-dashed border-gray-300 p-6 text-center">
							<Upload class="mx-auto h-8 w-8 text-gray-400" />
							<p class="mt-2 text-sm text-gray-500">Upload Videos</p>
							<p class="text-xs text-gray-400">MP4 (max. 100MB)</p>
							<Button variant="outline" class="mt-4">Browse Files</Button>
						</div>
					</div>
				</div>

				<Separator.Root class="my-2" />

				<div class="grid gap-2">
					<Label>Ad Copy Templates</Label>
					<div class="space-y-2">
						<div class="rounded-md border border-gray-200 p-3">
							<div class="flex items-center justify-between">
								<h4 class="font-medium">Weekend Special Template</h4>
								<Button variant="ghost" size="sm">Edit</Button>
							</div>
							<p class="mt-2 text-sm text-gray-600">
								"Enjoy our weekend special! [DEAL_DETAILS] at [RESTAURANT_NAME]. Valid [DAYS_VALID].
								#foodie #weekend"
							</p>
						</div>

						<div class="rounded-md border border-gray-200 p-3">
							<div class="flex items-center justify-between">
								<h4 class="font-medium">Limited Time Offer Template</h4>
								<Button variant="ghost" size="sm">Edit</Button>
							</div>
							<p class="mt-2 text-sm text-gray-600">
								"Limited time offer! [OFFER_DETAILS] - only at [RESTAURANT_NAME]. Don't miss out!
								#limitedtime #special"
							</p>
						</div>

						<Button variant="outline" class="w-full">
							<Tag class="mr-2 h-4 w-4" />
							Add New Template
						</Button>
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
