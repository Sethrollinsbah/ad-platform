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

	// Import our new components
	import HeaderComponent from './home-dash/header.svelte';
	import SummaryCards from './home-dash/summary-cards.svelte';
	import PerformanceChart from './home-dash/performance-chart.svelte';
	import ConversionMetrics from './home-dash/conversion-metrics.svelte';
	import CampaignTable from './home-dash/campaign-table.svelte';
	import AudienceBreakdown from './home-dash/audience-breakdown.svelte';

	// Register Chart.js components
	Chart.register(...registerables);

	// Date range state
	let dateRange = 'Last 14 Days';

	// Dashboard ref elements for charts
	let performanceChartEl;
	let conversionChartEl;
	let audienceChartEl;
	let sparklineEls = [null, null, null, null];

	// Charts instances
	let performanceChart;
	let conversionChart;
	let audienceChart;
	let sparklineCharts = [];

	// Sample performance data
	const performanceData = [
		{ name: 'Mar 1', impressions: 1200, clicks: 78, spend: 15 },
		{ name: 'Mar 2', impressions: 1320, clicks: 85, spend: 16.2 },
		{ name: 'Mar 3', impressions: 1450, clicks: 94, spend: 17.8 },
		{ name: 'Mar 4', impressions: 1390, clicks: 90, spend: 17.1 },
		{ name: 'Mar 5', impressions: 1520, clicks: 98, spend: 18.7 },
		{ name: 'Mar 6', impressions: 1650, clicks: 107, spend: 20.2 },
		{ name: 'Mar 7', impressions: 1700, clicks: 110, spend: 20.9 },
		{ name: 'Mar 8', impressions: 1580, clicks: 102, spend: 19.4 },
		{ name: 'Mar 9', impressions: 1620, clicks: 105, spend: 19.9 },
		{ name: 'Mar 10', impressions: 1720, clicks: 111, spend: 21.1 },
		{ name: 'Mar 11', impressions: 1810, clicks: 117, spend: 22.3 },
		{ name: 'Mar 12', impressions: 1890, clicks: 122, spend: 23.2 },
		{ name: 'Mar 13', impressions: 1930, clicks: 125, spend: 23.7 },
		{ name: 'Mar 14', impressions: 1760, clicks: 114, spend: 21.6 }
	];

	// Summary data
	const summaryCards = [
		{
			title: 'Total Impressions',
			value: '23,970',
			change: '+12.3%',
			icon: Users,
			iconColor: 'text-blue-500',
			chartData: performanceData.map((item) => item.impressions),
			lineColor: '#10b981',
			isNegative: false
		},
		{
			title: 'Total Clicks',
			value: '1,548',
			change: '+8.7%',
			icon: TrendingUp,
			iconColor: 'text-green-500',
			chartData: performanceData.map((item) => item.clicks),
			lineColor: '#10b981',
			isNegative: false
		},
		{
			title: 'CTR',
			value: '6.45%',
			change: '-0.2%',
			icon: ArrowUpRight,
			iconColor: 'text-amber-500',
			chartData: performanceData.map((item) => (item.clicks / item.impressions) * 100),
			lineColor: '#ef4444',
			isNegative: true
		},
		{
			title: 'Total Spend',
			value: '$294.40',
			change: '+4.1%',
			icon: DollarSign,
			iconColor: 'text-red-500',
			chartData: performanceData.map((item) => item.spend),
			lineColor: '#10b981',
			isNegative: false
		}
	];

	// Campaign performance data
	const campaignPerformance = [
		{
			name: 'Weekend Special',
			impressions: 12500,
			clicks: 625,
			ctr: 5.0,
			conversions: 94,
			cost: 154
		},
		{
			name: 'Lunch Deal',
			impressions: 9800,
			clicks: 490,
			ctr: 5.0,
			conversions: 73,
			cost: 121
		},
		{
			name: 'Happy Hour',
			impressions: 8200,
			clicks: 574,
			ctr: 7.0,
			conversions: 115,
			cost: 101
		},
		{
			name: 'Dinner for Two',
			impressions: 10300,
			clicks: 515,
			ctr: 5.0,
			conversions: 77,
			cost: 127
		}
	];
</script>

<div class="flex min-h-[calc(100dvh-4rem)] flex-col bg-gray-50">
	<!-- Navigation Header -->
	<HeaderComponent {dateRange} />

	<!-- Main Content -->
	<main class="flex-1 py-6">
		<div class="mx-auto max-w-7xl px-4">
			<!-- Summary Cards -->
			<SummaryCards {summaryCards} {sparklineEls} {sparklineCharts} />

			<!-- Performance Chart with Conversion Metrics -->
			<PerformanceChart {performanceChartEl} {performanceData}>
				<ConversionMetrics {conversionChartEl} />
			</PerformanceChart>

			<!-- Campaign Table & Audience -->
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<CampaignTable {campaignPerformance} />
				<AudienceBreakdown {audienceChartEl} />
			</div>
		</div>
	</main>
</div>
