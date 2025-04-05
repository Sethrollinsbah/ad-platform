<script lang="ts">
	import { settingsPanel } from '$lib';
	import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Clock } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Progress from '$lib/components/ui/progress';
	import { Badge } from '$lib/components/ui/badge';
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';

	// Register Chart.js components
	let chartInitialized = $state(false);
	let performanceChartEl: HTMLCanvasElement;
	let conversionChartEl: HTMLCanvasElement;
	let performanceChart: Chart;
	let conversionChart: Chart;

	// Sample performance data
	const performanceData = [
		{ date: 'Mar 1', impressions: 1200, clicks: 78, spend: 15 },
		{ date: 'Mar 5', impressions: 1520, clicks: 98, spend: 18.7 },
		{ date: 'Mar 10', impressions: 1720, clicks: 111, spend: 21.1 },
		{ date: 'Mar 15', impressions: 1890, clicks: 122, spend: 23.2 },
		{ date: 'Mar 20', impressions: 1930, clicks: 125, spend: 23.7 },
		{ date: 'Mar 25', impressions: 1760, clicks: 114, spend: 21.6 }
	];

	// Sample conversion data
	const conversionData = [
		{ name: 'Phone Calls', value: 42, color: '#ef4444' },
		{ name: 'Directions', value: 28, color: '#3b82f6' },
		{ name: 'Online Orders', value: 67, color: '#fbbf24' },
		{ name: 'Reservations', value: 53, color: '#10b981' }
	];

	// Sample campaign data
	const campaignData = {
		name: 'Weekend Special Promotion',
		status: 'Active',
		budget: 1200,
		spent: 487.25,
		impressions: 42350,
		clicks: 2118,
		conversions: 169,
		ctr: 5.0,
		startDate: '2025-03-01',
		endDate: '2025-04-15'
	};

	// Sample platform data
	const platformData = {
		name: 'Instagram',
		type: 'Social Media',
		budget: 450,
		budgetPercentage: 35,
		impressions: 22500,
		clicks: 1125,
		conversions: 90,
		ctr: 5.0,
		convRate: 8.0,
		cpc: 0.4,
		performance: [
			{ date: 'Mar 1', value: 58 },
			{ date: 'Mar 5', value: 65 },
			{ date: 'Mar 10', value: 82 },
			{ date: 'Mar 15', value: 75 },
			{ date: 'Mar 20', value: 90 },
			{ date: 'Mar 25', value: 85 }
		]
	};

	// Sample table data for database visualization
	let tableData = $state({
		name: 'Customers',
		rowCount: 2458,
		columnCount: 8,
		lastUpdated: '2025-03-28',
		size: '4.2MB',
		schema:
			$settingsPanel.data && $settingsPanel.data.schema
				? $settingsPanel.data.schema
				: [
						{ field: 'id', type: 'bigint', constraint: 'PRIMARY KEY' },
						{ field: 'name', type: 'varchar', constraint: 'NOT NULL' }
					],
		sampleQueries: [
			'SELECT * FROM customers WHERE created_at > NOW() - INTERVAL 7 DAYS',
			'SELECT COUNT(*) FROM customers GROUP BY EXTRACT(MONTH FROM created_at)'
		]
	});

	// Format numbers
	function formatNumber(num: number): string {
		return num.toLocaleString();
	}

	// Format currency
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(amount);
	}

	// Calculate budget utilization percentage
	function getBudgetUtilization(spent: number, budget: number): number {
		return Math.min(Math.round((spent / budget) * 100), 100);
	}

	onMount(() => {
		if (!chartInitialized && window) {
			chartInitialized = true;
			Chart.register(...registerables);

			// Initialize charts based on panel type
			if ($settingsPanel.type === 'campaign' && performanceChartEl) {
				initPerformanceChart();
			}

			if ($settingsPanel.type === 'platform' && conversionChartEl) {
				initConversionChart();
			}
		}
	});

	function initPerformanceChart() {
		performanceChart = new Chart(performanceChartEl, {
			type: 'line',
			data: {
				labels: performanceData.map((d) => d.date),
				datasets: [
					{
						label: 'Impressions',
						data: performanceData.map((d) => d.impressions),
						borderColor: '#3b82f6',
						backgroundColor: 'rgba(59, 130, 246, 0.1)',
						borderWidth: 2,
						tension: 0.3,
						yAxisID: 'y'
					},
					{
						label: 'Clicks',
						data: performanceData.map((d) => d.clicks),
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

	function initConversionChart() {
		conversionChart = new Chart(conversionChartEl, {
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
	}
</script>

<!-- Campaign Overview -->
{#if $settingsPanel.type === 'campaign'}
	<div class="space-y-6 py-6">
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
						<span class="text-sm font-bold">${(campaignData.spent / 30).toFixed(2)}</span>
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
							${(campaignData.spent / campaignData.conversions).toFixed(2)}
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
							{formatNumber(campaignData.impressions)}
						</div>
					</div>
					<div class="rounded-lg bg-red-50 p-3 text-center">
						<div class="text-sm font-medium text-gray-500">Clicks</div>
						<div class="text-xl font-bold text-red-700">{formatNumber(campaignData.clicks)}</div>
					</div>
					<div class="rounded-lg bg-green-50 p-3 text-center">
						<div class="text-sm font-medium text-gray-500">Conversions</div>
						<div class="text-xl font-bold text-green-700">
							{formatNumber(campaignData.conversions)}
						</div>
					</div>
				</div>

				<div class="mt-4 h-64">
					<canvas bind:this={performanceChartEl}></canvas>
				</div>

				<div class="mt-4 grid grid-cols-2 gap-4">
					<div class="rounded-lg border border-gray-200 p-3">
						<div class="text-sm font-medium text-gray-500">CTR</div>
						<div class="text-xl font-bold">{campaignData.ctr.toFixed(1)}%</div>
						<div class="mt-1 text-xs text-gray-500">Industry avg: 3.2%</div>
					</div>
					<div class="rounded-lg border border-gray-200 p-3">
						<div class="text-sm font-medium text-gray-500">Conversion Rate</div>
						<div class="text-xl font-bold">8.0%</div>
						<div class="mt-1 text-xs text-gray-500">Industry avg: 5.8%</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Platform Overview -->
{:else if $settingsPanel.type === 'platform'}
	<div class="space-y-6 py-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-2xl font-bold">{platformData.name}</h2>
				<div class="mt-1 flex items-center gap-2">
					<Badge variant="outline">{platformData.type}</Badge>
					<span class="text-sm text-gray-500">
						{platformData.budgetPercentage}% of total budget
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
			</div>
		</div>

		<!-- Budget Allocation -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-base">Budget Allocation</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="flex justify-between">
					<div>
						<div class="text-2xl font-bold">${platformData.budget}</div>
						<div class="text-sm text-gray-500">Platform Budget</div>
					</div>
					<div class="text-right">
						<div class="text-2xl font-bold">{platformData.budgetPercentage}%</div>
						<div class="text-sm text-gray-500">of Total Budget</div>
					</div>
				</div>

				<div class="mt-4">
					<div class="flex items-center justify-between text-sm">
						<span>Budget Distribution</span>
					</div>
					<div class="mt-2 h-8 w-full rounded-md bg-gray-200">
						<div
							class="h-full rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white"
							style="width: {platformData.budgetPercentage}%"
						>
							{platformData.budgetPercentage}%
						</div>
					</div>
				</div>

				<div class="mt-4 grid grid-cols-2 gap-4">
					<div class="rounded-md border border-gray-200 p-3">
						<div class="text-sm font-medium text-gray-500">Cost Per Click</div>
						<div class="text-xl font-bold">${platformData.cpc.toFixed(2)}</div>
						<div class="text-xs text-green-600">12% below average</div>
					</div>
					<div class="rounded-md border border-gray-200 p-3">
						<div class="text-sm font-medium text-gray-500">Cost Per Conversion</div>
						<div class="text-xl font-bold">$5.00</div>
						<div class="text-xs text-green-600">8% below average</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Performance Metrics -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-base">Performance Metrics</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-3 gap-4">
					<div class="rounded-lg bg-blue-50 p-3 text-center">
						<div class="text-sm font-medium text-gray-500">Impressions</div>
						<div class="text-xl font-bold text-blue-700">
							{formatNumber(platformData.impressions)}
						</div>
					</div>
					<div class="rounded-lg bg-red-50 p-3 text-center">
						<div class="text-sm font-medium text-gray-500">Clicks</div>
						<div class="text-xl font-bold text-red-700">{formatNumber(platformData.clicks)}</div>
					</div>
					<div class="rounded-lg bg-green-50 p-3 text-center">
						<div class="text-sm font-medium text-gray-500">Conversions</div>
						<div class="text-xl font-bold text-green-700">
							{formatNumber(platformData.conversions)}
						</div>
					</div>
				</div>

				<div class="mt-4 h-48">
					<canvas bind:this={conversionChartEl}></canvas>
				</div>

				<div class="mt-4 grid grid-cols-2 gap-4">
					<div class="rounded-lg border border-gray-200 p-3">
						<div class="text-sm font-medium text-gray-500">CTR</div>
						<div class="text-xl font-bold">{platformData.ctr.toFixed(1)}%</div>
						<div class="mt-1 text-xs text-green-600">1.8% above platform average</div>
					</div>
					<div class="rounded-lg border border-gray-200 p-3">
						<div class="text-sm font-medium text-gray-500">Conversion Rate</div>
						<div class="text-xl font-bold">{platformData.convRate.toFixed(1)}%</div>
						<div class="mt-1 text-xs text-green-600">2.2% above platform average</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Platform Insights -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-base">Platform Insights</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="rounded-lg bg-blue-50 p-4 text-sm">
					<p class="font-medium text-blue-800">Performance Recommendations</p>
					<ul class="mt-2 list-disc pl-5 text-blue-700">
						<li>Increase budget allocation by 5% to capitalize on strong CTR</li>
						<li>Create more video content to improve engagement rates</li>
						<li>Test new ad variations targeting the 25-34 age demographic</li>
					</ul>
				</div>

				<div class="mt-4 grid grid-cols-2 gap-4">
					<div class="rounded-lg border border-gray-200 p-3">
						<div class="text-sm font-medium text-gray-500">Best Performing Ad</div>
						<div class="text-md font-semibold">"Weekend Special - Family Deal"</div>
						<div class="mt-1 text-xs text-green-600">12.3% CTR</div>
					</div>
					<div class="rounded-lg border border-gray-200 p-3">
						<div class="text-sm font-medium text-gray-500">Best Conversion Time</div>
						<div class="text-md font-semibold">Fridays, 5-8 PM</div>
						<div class="mt-1 text-xs text-green-600">11.2% conversion rate</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Table (Database) Overview -->
{:else if $settingsPanel.type === 'table'}
	<div class="space-y-6 py-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-2xl font-bold">{tableData.name} Table</h2>
				<div class="mt-1 flex items-center gap-2">
					<Badge variant="outline">Database Table</Badge>
					<span class="text-sm text-gray-500">
						{tableData.rowCount.toLocaleString()} rows, {tableData.columnCount} columns
					</span>
				</div>
			</div>

			<div class="flex gap-2">
				<button class="rounded-md bg-blue-100 p-2 text-blue-600">
					<Calendar class="h-5 w-5" />
				</button>
			</div>
		</div>

		<!-- Table Information -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-base">Table Information</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-2 gap-4">
					<div class="rounded-lg bg-gray-50 p-3">
						<div class="text-sm font-medium text-gray-500">Row Count</div>
						<div class="text-xl font-bold">{tableData.rowCount.toLocaleString()}</div>
					</div>
					<div class="rounded-lg bg-gray-50 p-3">
						<div class="text-sm font-medium text-gray-500">Column Count</div>
						<div class="text-xl font-bold">{tableData.columnCount}</div>
					</div>
					<div class="rounded-lg bg-gray-50 p-3">
						<div class="text-sm font-medium text-gray-500">Last Updated</div>
						<div class="text-xl font-bold">{tableData.lastUpdated}</div>
					</div>
					<div class="rounded-lg bg-gray-50 p-3">
						<div class="text-sm font-medium text-gray-500">Size</div>
						<div class="text-xl font-bold">{tableData.size}</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Schema -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-base">Schema</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="overflow-x-auto rounded-md border border-gray-200">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Column Name
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Type
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Constraints
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each tableData.schema as column}
								<tr>
									<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
										{column.field}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
										{column.type}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
										{column.constraint}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Sample Queries -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-base">Sample Queries</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					{#each tableData.sampleQueries as query, index}
						<div class="rounded-md bg-gray-900 p-4">
							<pre class="overflow-x-auto text-sm text-white">{query}</pre>
						</div>
					{/each}
				</div>

				<div class="mt-4 rounded-lg bg-blue-50 p-4 text-sm">
					<p class="font-medium text-blue-800">Data Insights</p>
					<ul class="mt-2 list-disc pl-5 text-blue-700">
						<li>Customer growth increased by 15% in the last month</li>
						<li>53% of customers are located within 5 miles of the restaurant</li>
						<li>Most active customers place orders on Friday and Saturday evenings</li>
					</ul>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{/if}
