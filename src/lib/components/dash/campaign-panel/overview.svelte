// src/lib/components/dash/campaign-panel/overview.svelte
<script lang="ts">
	import { settingsPanel } from '$lib';
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';
	import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Clock } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Progress from '$lib/components/ui/progress';
	import { Badge } from '$lib/components/ui/badge';

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

	// Calculate budget utilization percentage
	function getBudgetUtilization(spent: number, budget: number): number {
		return Math.min(Math.round(((spent || 0) / (budget || 1)) * 100), 100);
	}
</script>

<!-- Campaign Overview -->
{#if $settingsPanel.type === 'campaign'}
	<div class="space-y-6 py-6">
		{#if isLoading || !campaignData}
			<div class="flex h-64 items-center justify-center">
				<div class="text-center">
					<div
						class="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"
					></div>
					<p class="text-gray-600">Loading campaign data...</p>
				</div>
			</div>
		{:else}
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="text-2xl font-bold">{campaignData.name}</h2>
					<div class="mt-1 flex items-center gap-2">
						<Badge variant={campaignData.status === 'Active' ? 'success' : 'secondary'}>
							{campaignData.status}
						</Badge>
						<span class="text-sm text-gray-500">
							{new Date(campaignData.startDate).toLocaleDateString()} -
							{new Date(campaignData.endDate).toLocaleDateString()}
						</span>
					</div>
				</div>

				<div class="flex gap-2">
					<button class="rounded-md bg-blue-100 p-2 text-blue-600">
						<Calendar class="h-5 w-5" />
					</button>
					<button class="rounded-md bg-amber-100 p-2 text-amber-600">
						<TrendingUp class="h-5 w-5" />
					</button>
					<button class="rounded-md bg-green-100 p-2 text-green-600">
						<BarChart3 class="h-5 w-5" />
					</button>
				</div>
			</div>

			<!-- Budget Progress -->
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-base">Budget Status</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex justify-between">
						<div>
							<div class="text-2xl font-bold">{formatCurrency(campaignData.budget)}</div>
							<div class="text-sm text-gray-500">Total Budget</div>
						</div>
						<div class="text-right">
							<div class="text-2xl font-bold">{formatCurrency(campaignData.spent)}</div>
							<div class="text-sm text-gray-500">Amount Spent</div>
						</div>
					</div>

					<div class="mt-4">
						<div class="flex items-center justify-between text-sm">
							<span>Budget Utilization</span>
							<span>{getBudgetUtilization(campaignData.spent, campaignData.budget)}%</span>
						</div>
						<Progress.Root
							value={getBudgetUtilization(campaignData.spent, campaignData.budget)}
							class="mt-1 h-2"
						/>
					</div>

					<div class="mt-4 grid grid-cols-3 gap-2 rounded-md bg-gray-50 p-2">
						<div class="flex flex-col items-center rounded-md bg-white p-2 shadow-sm">
							<DollarSign class="mb-1 h-4 w-4 text-green-500" />
							<span class="text-xs font-medium">Daily Spend</span>
							<span class="text-sm font-bold">${((campaignData.spent || 0) / 30).toFixed(2)}</span>
						</div>
						<div class="flex flex-col items-center rounded-md bg-white p-2 shadow-sm">
							<Clock class="mb-1 h-4 w-4 text-blue-500" />
							<span class="text-xs font-medium">Remaining</span>
							<span class="text-sm font-bold">18 days</span>
						</div>
						<div class="flex flex-col items-center rounded-md bg-white p-2 shadow-sm">
							<Users class="mb-1 h-4 w-4 text-purple-500" />
							<span class="text-xs font-medium">CPA</span>
							<span class="text-sm font-bold">
								${((campaignData.spent || 0) / (campaignData.metrics?.conversions || 1)).toFixed(2)}
							</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Performance Chart -->
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-base">Performance Metrics</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="grid grid-cols-3 gap-4">
						<div class="rounded-lg bg-blue-50 p-3 text-center">
							<div class="text-sm font-medium text-gray-500">Impressions</div>
							<div class="text-xl font-bold text-blue-700">
								{formatNumber(campaignData.metrics?.impressions)}
							</div>
						</div>
						<div class="rounded-lg bg-red-50 p-3 text-center">
							<div class="text-sm font-medium text-gray-500">Clicks</div>
							<div class="text-xl font-bold text-red-700">{formatNumber(campaignData.metrics?.clicks)}</div>
						</div>
						<div class="rounded-lg bg-green-50 p-3 text-center">
							<div class="text-sm font-medium text-gray-500">Conversions</div>
							<div class="text-xl font-bold text-green-700">
								{formatNumber(campaignData.metrics?.conversions)}
							</div>
						</div>
					</div>

					<div class="mt-4 h-64">
						<canvas bind:this={performanceChartEl}></canvas>
					</div>

					<div class="mt-4 grid grid-cols-2 gap-4">
						<div class="rounded-lg border border-gray-200 p-3">
							<div class="text-sm font-medium text-gray-500">CTR</div>
							<div class="text-xl font-bold">{campaignData.metrics?.ctr || '0.0'}%</div>
							<div class="mt-1 text-xs text-gray-500">Industry avg: 3.2%</div>
						</div>
						<div class="rounded-lg border border-gray-200 p-3">
							<div class="text-sm font-medium text-gray-500">Conversion Rate</div>
							<div class="text-xl font-bold">{campaignData.metrics?.conversionRate || '0.0'}%</div>
							<div class="mt-1 text-xs text-gray-500">Industry avg: 5.8%</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>
{:else if $settingsPanel.type === 'table'}
	<!-- Similar structure for Table Overview -->
	<div class="space-y-6 py-6">
		<div class="flex h-64 items-center justify-center">
			<div class="text-center">
				<p class="text-gray-600">Table data would be loaded from database</p>
			</div>
		</div>
	</div>
{/if}
