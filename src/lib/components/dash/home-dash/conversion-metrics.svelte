<script lang="ts">
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';
	import { Phone, Map, Utensils, Clock } from 'lucide-svelte';

	let {
		conversionChartEl,
		conversionData = [
			{ name: 'Phone Calls', value: 42, color: '#ef4444' },
			{ name: 'Directions', value: 28, color: '#3b82f6' },
			{ name: 'Online Orders', value: 67, color: '#fbbf24' },
			{ name: 'Reservations', value: 53, color: '#10b981' }
		]
	} = $props();

	onMount(() => {
		// Initialize the conversion chart (pie)
		const conversionChart = new Chart(conversionChartEl, {
			type: 'pie',
			data: {
				labels: conversionData.map((d) => d.name),
				datasets: [
					{
						data: conversionData.map((d) => d.value),
						backgroundColor: conversionData.map((d) => d.color),
						borderWidth: 1,
						borderColor: '#fff'
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom'
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
								const value = context.raw;
								const percentage = Math.round((value / total) * 100);
								return `${context.label}: ${value} (${percentage}%)`;
							}
						}
					}
				}
			}
		});
	});
</script>

<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
	<h2 class="mb-4 text-lg font-bold">Conversion Actions</h2>
	<div class="mb-4 h-48">
		<canvas bind:this={conversionChartEl}></canvas>
	</div>
	<div class="grid grid-cols-2 gap-2">
		<div class="rounded-lg bg-gray-50 p-3 text-center">
			<div class="flex items-center justify-center">
				<Phone class="mr-1 h-4 w-4 text-red-500" />
				<span class="text-sm font-semibold">42 Calls</span>
			</div>
		</div>
		<div class="rounded-lg bg-gray-50 p-3 text-center">
			<div class="flex items-center justify-center">
				<Map class="mr-1 h-4 w-4 text-blue-500" />
				<span class="text-sm font-semibold">28 Directions</span>
			</div>
		</div>
		<div class="rounded-lg bg-gray-50 p-3 text-center">
			<div class="flex items-center justify-center">
				<Utensils class="mr-1 h-4 w-4 text-amber-500" />
				<span class="text-sm font-semibold">67 Orders</span>
			</div>
		</div>
		<div class="rounded-lg bg-gray-50 p-3 text-center">
			<div class="flex items-center justify-center">
				<Clock class="mr-1 h-4 w-4 text-green-500" />
				<span class="text-sm font-semibold">53 Reservations</span>
			</div>
		</div>
	</div>
</div>
