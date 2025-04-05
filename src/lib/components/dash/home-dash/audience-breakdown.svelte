<script lang="ts">
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';

	let { audienceChartEl, audienceData = [
		{ name: 'Local Residents', value: 55 },
		{ name: 'Tourists', value: 20 },
		{ name: 'Work Lunch', value: 15 },
		{ name: 'Special Occasions', value: 10 }
	] } = $props();

	onMount(() => {
		// Initialize the audience chart (horizontal bar)
		const audienceChart = new Chart(audienceChartEl, {
			type: 'bar',
			data: {
				labels: audienceData.map((d) => d.name),
				datasets: [
					{
						label: 'Audience Breakdown',
						data: audienceData.map((d) => d.value),
						backgroundColor: '#ef4444',
						borderColor: '#b91c1c',
						borderWidth: 1
					}
				]
			},
			options: {
				indexAxis: 'y',
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Percentage'
						}
					}
				}
			}
		});
	});
</script>

<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
	<h2 class="mb-4 text-lg font-bold">Audience Breakdown</h2>
	<div class="mb-4 h-48">
		<canvas bind:this={audienceChartEl}></canvas>
	</div>
	<div class="rounded-lg bg-gray-50 p-3">
		<h3 class="mb-2 text-sm font-semibold">Audience Insights</h3>
		<p class="text-xs text-gray-600">
			Most of your ad clicks come from local residents within 5 miles of your restaurant, primarily
			on weekends and during dinner hours.
		</p>
	</div>
</div>
