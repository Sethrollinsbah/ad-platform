// src/lib/components/dash/home-dash.svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import {
		Calendar,
		Map,
		TrendingUp,
		Users,
		DollarSign,
		Utensils,
		Phone,
		Clock,
		Filter,
		Download,
		ArrowUpRight,
		Clipboard,
		ChevronDown
	} from 'lucide-svelte';

	// Import our components
	import HeaderComponent from './home-dash/header.svelte';
	import SummaryCards from './home-dash/summary-cards.svelte';
	import PerformanceChart from './home-dash/performance-chart.svelte';
	import ConversionMetrics from './home-dash/conversion-metrics.svelte';
	import CampaignTable from './home-dash/campaign-table.svelte';
	import AudienceBreakdown from './home-dash/audience-breakdown.svelte';
	import { projectId } from '@/lib';
	import { get } from 'svelte/store';

	// Register Chart.js components
	Chart.register(...registerables);

	// Date range state
	let dateRange = $state('Last 14 Days');

	// Dashboard ref elements for charts
	let performanceChartEl;
	let conversionChartEl;
	let audienceChartEl;
	let sparklineEls = $state([null, null, null, null]);

	// Charts instances
	let performanceChart;
	let conversionChart;
	let audienceChart;
	let sparklineCharts = $state([]);

	// Data state
	let performanceData = $state([]);
	let summaryCards = $state([]);
	let campaignPerformance = $state([]);
	let conversionData = $state([]);
	let isLoading = $state(true);

	// Function to fetch dashboard data
	async function fetchDashboardData() {
		try {
			isLoading = true;
			const currentProjectId = get(projectId);
			
			// Fetch restaurant data which includes campaigns
			const response = await fetch(`/api/restaurant/${currentProjectId}`);
			
			if (!response.ok) {
				throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
			}
			
			const data = await response.json();
			
			// Process performance data
			performanceData = data.campaigns.map(campaign => {
				// Extract metrics by date from campaign metrics
				return {
					name: campaign.name,
					impressions: campaign.metrics.impressions || 0,
					clicks: campaign.metrics.clicks || 0,
					spend: campaign.spent || 0
				};
			});
			
			// Setup summary cards
			const totalImpressions = data.campaigns.reduce((sum, c) => sum + (c.metrics.impressions || 0), 0);
			const totalClicks = data.campaigns.reduce((sum, c) => sum + (c.metrics.clicks || 0), 0);
			const totalConversions = data.campaigns.reduce((sum, c) => sum + (c.metrics.conversions || 0), 0);
			const totalSpend = data.statistics.totalSpent || 0;
			
			summaryCards = [
				{
					title: 'Total Impressions',
					value: totalImpressions.toLocaleString(),
					change: '+12.3%',
					icon: Users,
					iconColor: 'text-blue-500',
					chartData: [totalImpressions * 0.8, totalImpressions * 0.85, totalImpressions * 0.9, totalImpressions * 0.95, totalImpressions],
					lineColor: '#10b981',
					isNegative: false
				},
				{
					title: 'Total Clicks',
					value: totalClicks.toLocaleString(),
					change: '+8.7%',
					icon: TrendingUp,
					iconColor: 'text-green-500',
					chartData: [totalClicks * 0.8, totalClicks * 0.85, totalClicks * 0.9, totalClicks * 0.95, totalClicks],
					lineColor: '#10b981',
					isNegative: false
				},
				{
					title: 'CTR',
					value: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) + '%' : '0%',
					change: '-0.2%',
					icon: ArrowUpRight,
					iconColor: 'text-amber-500',
					chartData: [5.8, 5.9, 6.1, 6.3, 6.45],
					lineColor: '#ef4444',
					isNegative: true
				},
				{
					title: 'Total Spend',
					value: '$' + totalSpend.toLocaleString(),
					change: '+4.1%',
					icon: DollarSign,
					iconColor: 'text-red-500',
					chartData: [totalSpend * 0.8, totalSpend * 0.85, totalSpend * 0.9, totalSpend * 0.95, totalSpend],
					lineColor: '#10b981',
					isNegative: false
				}
			];
			
			// Setup campaign performance table
			campaignPerformance = data.campaigns.map(campaign => {
				const ctr = campaign.metrics.impressions > 0 
					? (campaign.metrics.clicks / campaign.metrics.impressions) * 100 
					: 0;
					
				return {
					name: campaign.name,
					impressions: campaign.metrics.impressions || 0,
					clicks: campaign.metrics.clicks || 0,
					ctr: ctr,
					conversions: campaign.metrics.conversions || 0,
					cost: campaign.spent || 0
				};
			});
			
			// Setup conversion data
			// This would typically come from conversion analytics in the database
			// For now, we'll simulate a distribution based on the total conversions
			conversionData = [
				{ name: 'Phone Calls', value: Math.floor(totalConversions * 0.35), color: '#ef4444' },
				{ name: 'Directions', value: Math.floor(totalConversions * 0.20), color: '#3b82f6' },
				{ name: 'Online Orders', value: Math.floor(totalConversions * 0.30), color: '#fbbf24' },
				{ name: 'Reservations', value: totalConversions - Math.floor(totalConversions * 0.35) - Math.floor(totalConversions * 0.20) - Math.floor(totalConversions * 0.30), color: '#10b981' }
			];
			
			isLoading = false;
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
			isLoading = false;
		}
	}

	onMount(() => {
		// Fetch dashboard data on mount
		fetchDashboardData();
		
		// Set up project change listener
		const unsubscribe = projectId.subscribe(() => {
			// Refetch data when project changes
			fetchDashboardData();
		});
		
		return () => {
			unsubscribe();
		};
	});
</script>

<div class="flex min-h-[calc(100dvh-4rem)] flex-col bg-gray-50">
	<!-- Navigation Header -->
	<HeaderComponent {dateRange} />

	<!-- Main Content -->
	<main class="flex-1 py-6">
		<div class="mx-auto max-w-7xl px-4">
			{#if isLoading}
				<div class="flex h-64 items-center justify-center">
					<div class="text-center">
						<div
							class="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"
						></div>
						<p class="text-gray-600">Loading dashboard data...</p>
					</div>
				</div>
			{:else}
				<!-- Summary Cards -->
				<SummaryCards {summaryCards} {sparklineEls} {sparklineCharts} />

				<!-- Performance Chart with Conversion Metrics -->
				<PerformanceChart {performanceChartEl} {performanceData}>
					<ConversionMetrics {conversionChartEl} {conversionData} />
				</PerformanceChart>

				<!-- Campaign Table & Audience -->
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<CampaignTable {campaignPerformance} />
					<AudienceBreakdown {audienceChartEl} />
				</div>
			{/if}
		</div>
	</main>
</div>
