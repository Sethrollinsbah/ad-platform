<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ShoppingBag, Coffee, BarChart4, Calendar } from 'lucide-svelte';

	let {
		onBack = () => {},
		onSelect = (id: string) => {},
		tableTypes = [
			{
				id: 'customers',
				name: 'Customers',
				icon: ShoppingBag,
				color: '#4285F4',
				description: 'Customer data for targeting'
			},
			{
				id: 'products',
				name: 'Menu Items',
				icon: Coffee,
				color: '#FF5252',
				description: 'Restaurant menu tracking'
			},
			{
				id: 'orders',
				name: 'Orders',
				icon: ShoppingBag,
				color: '#FBBC05',
				description: 'Order history and analytics'
			},
			{
				id: 'campaigns',
				name: 'Campaigns',
				icon: BarChart4,
				color: '#34A853',
				description: 'Campaign performance data'
			},
			{
				id: 'reservations',
				name: 'Reservations',
				icon: Calendar,
				color: '#E1306C',
				description: 'Table booking information'
			}
		]
	} = $props();
</script>

<div>
	<div class="mb-4">
		<Button variant="outline" size="sm" on:click={onBack}>← Back</Button>
	</div>

	<h3 class="mb-4 text-lg font-medium">Choose Data Table Type</h3>

	<div class="grid gap-3">
		{#each tableTypes as table}
			<Button
				variant="outline"
				class="flex h-auto items-start justify-start gap-3 p-3 text-left"
				on:click={() => onSelect(table.id)}
			>
				<div
					class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
					style="background-color: {table.color}25;"
				>
					<svelte:component this={table.icon} class="h-5 w-5" style="color: {table.color};" />
				</div>
				<div>
					<div class="font-medium">{table.name}</div>
					<div class="text-sm text-gray-500">{table.description}</div>
				</div>
			</Button>
		{/each}
	</div>
</div>
