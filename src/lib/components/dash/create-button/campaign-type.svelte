<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Calendar, Coffee, Pizza, Utensils, Tag } from 'lucide-svelte';

	let {
		onBack = () => {},
		onSelect = (id: string) => {},
		campaignTypes = [
			{
				id: 'weekend-special',
				name: 'Weekend Special',
				icon: Calendar,
				color: '#FF5252',
				description: 'Limited-time weekend promotions'
			},
			{
				id: 'happy-hour',
				name: 'Happy Hour',
				icon: Coffee,
				color: '#FBBC05',
				description: 'Discounted drinks during specific hours'
			},
			{
				id: 'dinner-deal',
				name: 'Dinner Deal',
				icon: Utensils,
				color: '#4285F4',
				description: 'Special meal packages for dinner time'
			},
			{
				id: 'lunch-promo',
				name: 'Lunch Promotion',
				icon: Pizza,
				color: '#34A853',
				description: 'Weekday lunch special offers'
			},
			{
				id: 'seasonal-menu',
				name: 'Seasonal Menu',
				icon: Tag,
				color: '#EA4335',
				description: 'Limited-time seasonal dishes campaign'
			}
		]
	} = $props();
</script>

<div>
	<div class="mb-4">
		<Button variant="outline" size="sm" on:click={onBack}>← Back</Button>
	</div>

	<h3 class="mb-4 text-lg font-medium">Choose Campaign Type</h3>

	<div class="grid gap-3">
		{#each campaignTypes as campaign}
			<Button
				variant="outline"
				class="flex h-auto items-start justify-start gap-3 p-3 text-left"
				on:click={() => onSelect(campaign.id)}
			>
				<div
					class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
					style="background-color: {campaign.color}25;"
				>
					<svelte:component this={campaign.icon} class="h-5 w-5" style="color: {campaign.color};" />
				</div>
				<div>
					<div class="font-medium">{campaign.name}</div>
					<div class="text-sm text-gray-500">{campaign.description}</div>
				</div>
			</Button>
		{/each}
	</div>
</div>
