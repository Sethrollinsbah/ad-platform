// src/lib/components/dash/campaign-panel/overview.svelte
<script lang="ts">
	import { settingsPanel } from '$lib';
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';
	import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Clock } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Progress from '$lib/components/ui/progress';
	import { Badge } from '$lib/components/ui/badge';
	import OverviewTable from './overview-table.svelte';
	import OverviewCampaign from './overview-campaign.svelte';

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

	<OverviewCampaign></OverviewCampaign>
{:else if $settingsPanel.type === 'table'}
	<!-- Similar structure for Table Overview -->

	<OverviewTable></OverviewTable>
{/if}
