<script lang="ts">
	import { settingsPanel } from '$lib';
	import { Chart, registerables } from 'chart.js';
	import { Settings } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '../../ui/label';
	import { Input } from '../../ui/input';
	import * as Select from '../../ui/select';
	import * as Switch from '../../ui/switch';
	import { Button } from '../../ui/button';

	let campaignData = $state(null);
	let performanceChartEl;
	let conversionChartEl;
	let performanceChart;
	let conversionChart;
	let chartInitialized = $state(false);
	let isLoading = $state(true);
	let dailyMetrics = $state([]);
	let conversionBreakdown = $state([]);

	// Use $effect to watch for changes to settingsPanel
	$effect(() => {
		if ($settingsPanel.id) {
			fetchCampaignData();
		}
	});

	// Fetch campaign data
	async function fetchCampaignData() {
		try {
			isLoading = true;

			// Get node ID from settings panel
			const nodeId = $settingsPanel.id;

			if (!nodeId) {
				isLoading = false;
				return;
			}

			// Extract campaign ID from node ID
			// Assuming format like "campaign-weekend-special" -> "weekend-special"
			const campaignId = nodeId.split('-').slice(1).join('-');

			// Fetch campaign data from API
			const response = await fetch(`/api/campaign/${campaignId}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch campaign data: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();

			// Update campaign data
			campaignData = data.campaign;
			dailyMetrics = data.dailyMetrics || [];
			conversionBreakdown = data.conversionBreakdown || [];

			isLoading = false;

			// Initialize charts after data is loaded
			setTimeout(() => {
				if (!chartInitialized && window) {
					chartInitialized = true;
					Chart.register(...registerables);

					if ($settingsPanel.type === 'campaign' && performanceChartEl) {
						initPerformanceChart(dailyMetrics);
					}

					if ($settingsPanel.type === 'platform' && conversionChartEl) {
						initConversionChart(conversionBreakdown);
					}
				}
			}, 100);
		} catch (error) {
			console.error('Error fetching campaign data:', error);
			isLoading = false;
		}
	}

	// Initialize performance chart
	function initPerformanceChart(metricsData) {
		performanceChart = new Chart(performanceChartEl, {
			type: 'line',
			data: {
				labels: metricsData.map((d) => d.date),
				datasets: [
					{
						label: 'Impressions',
						data: metricsData.map((d) => d.impressions),
						borderColor: '#3b82f6',
						backgroundColor: 'rgba(59, 130, 246, 0.1)',
						borderWidth: 2,
						tension: 0.3,
						yAxisID: 'y'
					},
					{
						label: 'Clicks',
						data: metricsData.map((d) => d.clicks),
						borderColor: '#ef4444',
						backgroundColor: 'rgba(239, 68, 68, 0.1)',
						borderWidth: 2,
						tension: 0.3,
						yAxisID: 'y1'
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: 'index',
					intersect: false
				},
				scales: {
					y: {
						type: 'linear',
						display: true,
						position: 'left',
						title: {
							display: true,
							text: 'Impressions'
						}
					},
					y1: {
						type: 'linear',
						display: true,
						position: 'right',
						grid: {
							drawOnChartArea: false
						},
						title: {
							display: true,
							text: 'Clicks'
						}
					}
				}
			}
		});
	}

	// Initialize conversion chart
	function initConversionChart(conversionData) {
		conversionChart = new Chart(conversionChartEl, {
			type: 'pie',
			data: {
				labels: conversionData.map((d) => d.type),
				datasets: [
					{
						data: conversionData.map((d) => d.count),
						backgroundColor: ['#ef4444', '#3b82f6', '#fbbf24', '#10b981'],
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
	}

	// Format numbers
	function formatNumber(num: number): string {
		return num?.toLocaleString() || '0';
	}

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
</script>

<form on:submit|preventDefault={handleCampaignSubmit} class="space-y-4">
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<Settings class="h-5 w-5 text-gray-500" />
				Campaign Settings
			</Card.Title>
			<Card.Description>Configure the basic settings for your campaign.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="campaign-name">Campaign Name</Label>
					<Input
						id="campaign-name"
						bind:value={campaignSettings.name}
						placeholder="Enter campaign name"
						required
					/>
				</div>

				<div class="grid gap-2">
					<Label for="campaign-status">Status</Label>
					<Select.Root value={campaignSettings.status}>
						<Select.Trigger id="campaign-status" class="w-full">
							<Select.Value placeholder="Select campaign status" />
						</Select.Trigger>
						<Select.Content>
							{#each statusOptions as option}
								<Select.Item value={option.value}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid gap-2">
					<Label>Campaign Notifications</Label>
					<div class="flex items-center">
						<Switch.Root id="notifications-toggle" checked={campaignSettings.notifications}>
							<Switch.Thumb />
						</Switch.Root>
						<Label for="notifications-toggle" class="ml-2">Send performance notifications</Label>
					</div>
					<p class="text-xs text-gray-500">
						Receive daily updates about campaign performance via email and in-app notifications.
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
