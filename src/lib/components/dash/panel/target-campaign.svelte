<script lang="ts">
	import { Target } from 'lucide-svelte';
	import * as Card from '../../ui/card';
	import { Label } from '../../ui/label';
	import * as Select from '../../ui/select';
	import { Button } from '../../ui/button';

	// Form handlers

	// Format currency
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(amount || 0);
	}
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
	// Calculate budget utilization percentage
	function handleCampaignSubmit() {
		// In a real app, this would save to the backend
		alert('Campaign settings updated!');
	}
	// Target audience options
	const targetOptions = [
		{ value: 'local_customers', label: 'Local Customers (5mi radius)' },
		{ value: 'regional_customers', label: 'Regional Customers (20mi radius)' },
		{ value: 'tourists', label: 'Tourists & Visitors' },
		{ value: 'business_lunch', label: 'Business Lunch Crowd' },
		{ value: 'families', label: 'Families with Children' },
		{ value: 'evening_diners', label: 'Evening & Weekend Diners' }
	];
</script>

<form on:submit|preventDefault={handleCampaignSubmit} class="space-y-4">
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<Target class="h-5 w-5 text-gray-500" />
				Audience Targeting
			</Card.Title>
			<Card.Description>Define who should see your campaign ads.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="target-audience">Primary Target Audience</Label>
					<Select.Root value={campaignSettings.target}>
						<Select.Trigger id="target-audience" class="w-full">
							<Select.Value placeholder="Select target audience" />
						</Select.Trigger>
						<Select.Content>
							{#each targetOptions as option}
								<Select.Item value={option.value}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid gap-2">
					<Label>Location</Label>
					<div class="rounded-md border border-gray-200 p-3">
						<div class="flex items-center space-x-2">
							<input type="radio" id="location-restaurant" name="location" checked={true} />
							<Label for="location-restaurant" class="cursor-pointer text-sm font-normal">
								Restaurant Location (5 mile radius)
							</Label>
						</div>

						<div class="mt-2 flex items-center space-x-2">
							<input type="radio" id="location-custom" name="location" />
							<Label for="location-custom" class="cursor-pointer text-sm font-normal">
								Custom Location
							</Label>
						</div>

						<Button variant="outline" class="mt-3 w-full">Edit Geographic Targeting</Button>
					</div>
				</div>

				<div class="grid gap-2">
					<Label>Demographics</Label>
					<div class="space-y-3">
						<div class="rounded-md border border-gray-200 p-3">
							<Label class="text-sm">Age Range</Label>
							<div class="mt-2 flex flex-wrap gap-2">
								{#each ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'] as ageRange}
									<Button
										variant={['25-34', '35-44'].includes(ageRange) ? 'default' : 'outline'}
										class="h-8 text-xs"
									>
										{ageRange}
									</Button>
								{/each}
							</div>
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
