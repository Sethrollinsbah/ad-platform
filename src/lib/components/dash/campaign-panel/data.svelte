<script lang="ts">
	import { settingsPanel } from '$lib';
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import * as Card from '$lib/components/ui/card';
	import * as Progress from '$lib/components/ui/progress';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import {
		BarChart3,
		Download,
		Filter,
		Calendar,
		ChevronDown,
		FileText,
		RefreshCw,
		Database,
		Search,
		ArrowUpRight,
		ArrowDownRight,
		Clock,
		Users,
		Table as TableIcon,
		AlertCircle,
		InfoIcon,
		Trash2
	} from 'lucide-svelte';

	// Chart references
	let growthChartEl: HTMLCanvasElement;
	let distributionChartEl: HTMLCanvasElement;
	let typeChartEl: HTMLCanvasElement;
	let growthChart: Chart;
	let distributionChart: Chart;
	let typeChart: Chart;
	let chartInitialized = $state(false);

	// Date range state
	let dateRange = 'Last 30 Days';
	let searchQuery = '';
	let selectedView = 'all';

	// Sample table data
	const tableData = {
		name: 'Customers',
		totalRecords: 2458,
		recentRecords: 112,
		schema: [
			{ name: 'id', type: 'bigint', nonNull: true, count: 2458, description: 'Primary key' },
			{ name: 'name', type: 'varchar(255)', nonNull: true, count: 2458, description: 'Customer name' },
			{ name: 'email', type: 'varchar(255)', nonNull: true, count: 2431, description: 'Email address' },
			{ name: 'phone', type: 'varchar(20)', nonNull: false, count: 1897, description: 'Phone number' },
			{ 
				name: 'address', 
				type: 'varchar(255)', 
				nonNull: false, 
				count: 1745, 
				description: 'Street address' 
			},
			{ 
				name: 'city', 
				type: 'varchar(100)', 
				nonNull: false, 
				count: 1842, 
				description: 'City name' 
			},
			{ 
				name: 'zip', 
				type: 'varchar(20)', 
				nonNull: false, 
				count: 1824, 
				description: 'ZIP/Postal code' 
			},
			{ 
				name: 'created_at', 
				type: 'timestamp', 
				nonNull: true, 
				count: 2458, 
				description: 'Account creation date' 
			},
			{ 
				name: 'last_order_date', 
				type: 'timestamp', 
				nonNull: false, 
				count: 1975, 
				description: 'Most recent order date' 
			},
			{ 
				name: 'order_count', 
				type: 'integer', 
				nonNull: true, 
				count: 2458, 
				description: 'Total number of orders' 
			},
			{ 
				name: 'total_spent', 
				type: 'decimal(10,2)', 
				nonNull: true, 
				count: 2458, 
				description: 'Total amount spent' 
			}
		],
		growthData: [
			{ date: '2025-01-01', count: 1956 },
			{ date: '2025-01-15', count: 2015 },
			{ date: '2025-02-01', count: 2087 },
			{ date: '2025-02-15', count: 2156 },
			{ date: '2025-03-01', count: 2245 },
			{ date: '2025-03-15', count: 2354 },
			{ date: '2025-03-30', count: 2458 }
		],
		sampleData: [
			{
				id: 1,
				name: 'Jane Smith',
				email: 'jane.smith@example.com',
				phone: '(555) 123-4567',
				address: '123 Main St',
				city: 'Springfield',
				zip: '12345',
				created_at: '2025-02-15',
				last_order_date: '2025-03-25',
				order_count: 5,
				total_spent: 187.45
			},
			{
				id: 2,
				name: 'John Davis',
				email: 'john.davis@example.com',
				phone: '(555) 987-6543',
				address: '456 Oak Ave',
				city: 'Rivertown',
				zip: '23456',
				created_at: '2025-01-22',
				last_order_date: '2025-03-20',
				order_count: 3,
				total_spent: 124.30
			},
			{
				id: 3,
				name: 'Maria Rodriguez',
				email: 'maria.r@example.com',
				phone: '(555) 456-7890',
				address: '789 Pine St',
				city: 'Springfield',
				zip: '12345',
				created_at: '2025-03-05',
				last_order_date: '2025-03-28',
				order_count: 1,
				total_spent: 42.75
			},
			{
				id: 4,
				name: 'Robert Johnson',
				email: 'r.johnson@example.com',
				phone: '(555) 321-9876',
				address: '234 Elm St',
				city: 'Lakeside',
				zip: '34567',
				created_at: '2025-02-18',
				last_order_date: '2025-03-15',
				order_count: 2,
				total_spent: 83.60
			},
			{
				id: 5,
				name: 'Sarah Williams',
				email: 'sarah.w@example.com',
				phone: '(555) 789-0123',
				address: '567 Maple Dr',
				city: 'Rivertown',
				zip: '23456',
				created_at: '2025-03-12',
				last_order_date: null,
				order_count: 0,
				total_spent: 0.00
			}
		],
		topQueries: [
			{
				name: 'Frequent Customers',
				query: 'SELECT * FROM customers WHERE order_count > 10 ORDER BY total_spent DESC LIMIT 100',
				lastRun: '2025-03-29',
				runtime: '0.12s'
			},
			{
				name: 'New Customers This Month',
				query: 'SELECT * FROM customers WHERE created_at >= DATE_TRUNC(\'month\', CURRENT_DATE)',
				lastRun: '2025-03-30',
				runtime: '0.09s'
			},
			{
				name: 'High Value Customers',
				query: 'SELECT * FROM customers WHERE total_spent > 500 ORDER BY last_order_date DESC',
				lastRun: '2025-03-28',
				runtime: '0.15s'
			}
		],
		dataIssues: [
			{
				type: 'Missing Values',
				field: 'phone',
				count: 561,
				percentage: 22.8
			},
			{
				type: 'Missing Values',
				field: 'address',
				count: 713,
				percentage: 29.0
			},
			{
				type: 'Missing Values',
				field: 'last_order_date',
				count: 483,
				percentage: 19.6
			}
		],
		valueDistribution: [
			{ city: 'Springfield', count: 743, percentage: 30.2 },
			{ city: 'Rivertown', count: 586, percentage: 23.8 },
			{ city: 'Lakeside', count: 421, percentage: 17.1 },
			{ city: 'Hillcrest', count: 317, percentage: 12.9 },
			{ city: 'Other', count: 391, percentage: 15.9 }
		]
	};

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

	// Filter schema fields based on search query
	let filteredSchema = $derived(
		searchQuery 
			? tableData.schema.filter(field => 
				field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				field.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
				field.description.toLowerCase().includes(searchQuery.toLowerCase())
			)
			: tableData.schema
	);

	// Calculate completeness percentage
	function getCompletenessPercentage(count: number): number {
		return (count / tableData.totalRecords) * 100;
	}

	// Initialize charts
	onMount(() => {
		if (!chartInitialized && window) {
			chartInitialized = true;
			Chart.register(...registerables);

			initGrowthChart();
			initDistributionChart();
			initTypeChart();
		}
	});

	function initGrowthChart() {
		growthChart = new Chart(growthChartEl, {
			type: 'line',
			data: {
				labels: tableData.growthData.map(d => {
					const date = new Date(d.date);
					return `${date.getMonth() + 1}/${date.getDate()}`;
				}),
				datasets: [{
					label: 'Records',
					data: tableData.growthData.map(d => d.count),
					borderColor: '#3b82f6',
					backgroundColor: 'rgba(59, 130, 246, 0.1)',
					borderWidth: 2,
					tension: 0.3,
					fill: true
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						mode: 'index',
						intersect: false
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text: 'Date'
						}
					},
					y: {
						beginAtZero: false,
						title: {
							display: true,
							text: 'Total Records'
						}
					}
				}
			}
		});
	}

	function initDistributionChart() {
		distributionChart = new Chart(distributionChartEl, {
			type: 'pie',
			data: {
				labels: tableData.valueDistribution.map(d => d.city),
				datasets: [{
					data: tableData.valueDistribution.map(d => d.count),
					backgroundColor: [
						'#3b82f6', // blue
						'#10b981', // green
						'#f59e0b', // amber
						'#ef4444', // red
						'#8b5cf6'  // purple
					],
					borderWidth: 1,
					borderColor: '#fff'
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'right',
						labels: {
							boxWidth: 12
						}
					},
					tooltip: {
						callbacks: {
							label: function(context) {
								const value = context.raw as number;
								const total = tableData.valueDistribution.reduce((sum, item) => sum + item.count, 0);
								const percentage = ((value / total) * 100).toFixed(1);
								return `${context.label}: ${value} (${percentage}%)`;
							}
						}
					}
				}
			}
		});
	}

	function initTypeChart() {
		// Count fields by data type
		const typeGroups = tableData.schema.reduce((acc, field) => {
			const baseType = field.type.split('(')[0];
			acc[baseType] = (acc[baseType] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const types = Object.keys(typeGroups);
		const counts = Object.values(typeGroups);

		typeChart = new Chart(typeChartEl, {
			type: 'bar',
			data: {
				labels: types,
				datasets: [{
					label: 'Fields',
					data: counts,
					backgroundColor: [
						'#3b82f6', // blue
						'#10b981', // green
						'#f59e0b', // amber
						'#ef4444', // red
						'#8b5cf6', // purple
						'#ec4899'  // pink
					],
					borderWidth: 0
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				indexAxis: 'y',
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Count'
						}
					},
					y: {
						title: {
							display: true,
							text: 'Data Type'
						}
					}
				}
			}
		});
	}
</script>

<!-- Table Data Analysis -->
{#if $settingsPanel.type === 'table'}
	<div class="space-y-6 py-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-2xl font-bold">{tableData.name} Table Data</h2>
				<p class="text-sm text-gray-500">Comprehensive data analysis and profiling</p>
			</div>

			<div class="flex gap-2">
				<div class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
					<Calendar class="h-4 w-4 text-gray-500" />
					<span>{dateRange}</span>
					<ChevronDown class="h-4 w-4 text-gray-500" />
				</div>

				<button class="rounded-md bg-blue-100 p-2 text-blue-600">
					<Download class="h-5 w-5" />
				</button>
			</div>
		</div>

		<!-- Table Overview Metrics -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-base">Table Overview</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div class="rounded-lg bg-blue-50 p-3 text-center">
						<div class="text-sm font-medium text-gray-500">Total Records</div>
						<div class="text-xl font-bold text-blue-700">
							{formatNumber(tableData.totalRecords)}
						</div>
						<div class="mt-1 flex items-center justify-center text-xs">
							<ArrowUpRight class="mr-1 h-3 w-3 text-green-500" />
							<span class="text-green-500">+{tableData.recentRecords} new</span>
						</div>
					</div>

					<div class="rounded-lg bg-emerald-50 p-3 text-center">
						<div class="text-sm font-medium text-gray-500">Fields/Columns</div>
						<div class="text-xl font-bold text-emerald-700">
							{tableData.schema.length}
						</div>
						<div class="mt-1 flex items-center justify-center text-xs text-emerald-500">
							{tableData.schema.filter(f => f.nonNull).length} required fields
						</div>
					</div>

					<div class="rounded-lg bg-purple-50 p-3 text-center">
						<div class="text-sm font-medium text-gray-500">Data Completeness</div>
						<div class="text-xl font-bold text-purple-700">
							{((tableData.schema.reduce((sum, field) => sum + field.count, 0) / 
                            (tableData.totalRecords * tableData.schema.length)) * 100).toFixed(1)}%
						</div>
						<div class="mt-1 flex items-center justify-center text-xs">
							<span class="text-purple-500">Overall data quality</span>
						</div>
					</div>

					<div class="rounded-lg bg-amber-50 p-3 text-center">
						<div class="text-sm font-medium text-gray-500">Growth Rate</div>
						<div class="text-xl font-bold text-amber-700">
							+{(((tableData.totalRecords - tableData.growthData[0].count) / 
                            tableData.growthData[0].count) * 100).toFixed(1)}%
						</div>
						<div class="mt-1 flex items-center justify-center text-xs text-amber-500">
							Past 90 days
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Records Growth Chart -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-base">Records Growth</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="h-64">
					<canvas bind:this={growthChartEl}></canvas>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Schema Information -->
		<Card.Root>
			<Card.Header class="pb-2">
				<div class="flex items-center justify-between">
					<Card.Title class="text-base">Schema Definition</Card.Title>
					<div class="flex items-center gap-2">
						<div class="relative">
							<Search class="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search fields..."
								class="pl-8"
								bind:value={searchQuery}
							/>
						</div>
						
						<div class="flex rounded-md border border-gray-200 text-sm">
							<button 
								class={`px-3 py-1 ${selectedView === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'}`}
								on:click={() => selectedView = 'all'}
							>
								All
							</button>
							<button 
								class={`px-3 py-1 ${selectedView === 'required' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'}`}
								on:click={() => selectedView = 'required'}
							>
								Required
							</button>
							<button 
								class={`px-3 py-1 ${selectedView === 'issues' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'}`}
								on:click={() => selectedView = 'issues'}
							>
								Issues
							</button>
						</div>
					</div>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Field Name</Table.Head>
								<Table.Head>Type</Table.Head>
								<Table.Head class="text-center">Required</Table.Head>
								<Table.Head>Completeness</Table.Head>
								<Table.Head>Description</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each filteredSchema.filter(field => {
								if (selectedView === 'all') return true;
								if (selectedView === 'required') return field.nonNull;
								if (selectedView === 'issues') return field.count < tableData.totalRecords;
								return true;
							}) as field}
								<Table.Row>
									<Table.Cell class="font-semibold">{field.name}</Table.Cell>
									<Table.Cell>
										<Badge variant="outline" class="font-mono">{field.type}</Badge>
									</Table.Cell>
									<Table.Cell class="text-center">
										{#if field.nonNull}
											<Badge variant="default" class="bg-green-100 text-green-800 hover:bg-green-100">Yes</Badge>
										{:else}
											<Badge variant="outline" class="border-gray-200 text-gray-500">No</Badge>
										{/if}
									</Table.Cell>
									<Table.Cell>
										<div class="flex items-center">
											<Progress.Root
												value={getCompletenessPercentage(field.count)}
												class="mr-2 h-2 w-24"
												style="background-color: #e5e7eb;"
											/>
											<span class="text-xs">{((field.count / tableData.totalRecords) * 100).toFixed(1)}%</span>
										</div>
									</Table.Cell>
									<Table.Cell class="text-sm text-gray-500">{field.description}</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Charts & Visualizations -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<!-- City Distribution -->
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-base">City Distribution</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="h-64">
						<canvas bind:this={distributionChartEl}></canvas>
					</div>
					<div class="mt-4">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>City</Table.Head>
									<Table.Head class="text-right">Count</Table.Head>
									<Table.Head class="text-right">Percentage</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each tableData.valueDistribution as city}
									<Table.Row>
										<Table.Cell class="font-medium">{city.city}</Table.Cell>
										<Table.Cell class="text-right">{city.count}</Table.Cell>
										<Table.Cell class="text-right">{city.percentage.toFixed(1)}%</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Data Type Distribution -->
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-base">Field Types</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="h-64">
						<canvas bind:this={typeChartEl}></canvas>
					</div>
					<div class="mt-4 rounded-lg bg-gray-50 p-3">
						<div class="flex items-center">
							<InfoIcon class="mr-2 h-4 w-4 text-blue-500" />
							<span class="text-sm font-medium">Schema Analysis</span>
						</div>
						<p class="mt-1 text-sm text-gray-600">
							This table primarily contains string and numeric data. The timestamp fields allow for time-based analysis of customer activity and ordering patterns.
						</p>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Sample Data -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="flex items-center gap-2 text-base">
					<TableIcon class="h-4 w-4 text-gray-500" />
					Sample Data
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>ID</Table.Head>
								<Table.Head>Name</Table.Head>
								<Table.Head>Email</Table.Head>
								<Table.Head>City</Table.Head>
								<Table.Head>Created</Table.Head>
								<Table.Head>Orders</Table.Head>
								<Table.Head>Total Spent</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each tableData.sampleData as record}
								<Table.Row>
									<Table.Cell class="font-mono text-xs">{record.id}</Table.Cell>
									<Table.Cell class="font-medium">{record.name}</Table.Cell>
									<Table.Cell>{record.email}</Table.Cell>
									<Table.Cell>{record.city}</Table.Cell>
									<Table.Cell>{record.created_at}</Table.Cell>
									<Table.Cell class="text-center">{record.order_count}</Table.Cell>
									<Table.Cell class="text-right">{formatCurrency(record.total_spent)}</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Common Queries -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-base">Common Queries</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					{#each tableData.topQueries as query}
						<div class="rounded-lg border border-gray-200 p-4">
							<div class="flex items-center justify-between">
								<h4 class="font-medium">{query.name}</h4>
								<Badge variant="outline" class="text-xs">Last run: {query.lastRun}</Badge>
							</div>
							<pre class="mt-2 overflow-x-auto rounded-md bg-gray-50 p-3 text-xs"><code>{query.query}</code></pre>
							<div class="mt-2 flex items-center justify-between">
								<span class="text-xs text-gray-500">Runtime: {query.runtime}</span>
								<Button variant="outline" size="sm" class="text-xs">Run Query</Button>
							</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Data Quality Issues -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="flex items-center gap-2 text-base">
					<AlertCircle class="h-4 w-4 text-amber-500" />
					Data Quality Issues
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					{#each tableData.dataIssues as issue}
						<div class="rounded-lg border border-amber-200 bg-amber-50 p-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<span class="font-medium text-amber-800">{issue.type}: {issue.field}</span>
								</div>
								<Badge variant="outline" class="border-amber-300 text-amber-800">
									{issue.count} records ({issue.percentage.toFixed(1)}%)
								</Badge>
							</div>
							<p class="mt-2 text-sm text-amber-700">
								{issue.count} records are missing values in the {issue.field} field.
								This may impact analysis and customer communication.
							</p>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Actions Row -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<Card.Root>
				<Card.Content class="flex items-center gap-4 p-4">
					<div
						class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100"
					>
						<Download class="h-6 w-6 text-blue-600" />
					</div>
					<div>
						<h3 class="font-medium">Export Data</h3>
						<p class="text-sm text-gray-500">Download as CSV or Excel</p>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Content class="flex items-center gap-4 p-4">
					<div
						class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100"
					>
						<RefreshCw class="h-6 w-6 text-green-600" />
					</div>
					<div>
						<h3 class="font-medium">Refresh Data</h3>
						<p class="text-sm text-gray-500">Update from source</p>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Content class="flex items-center gap-4 p-4">
					<div
						class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100"
					>
						<Trash2 class="h-6 w-6 text-red-600" />
					</div>
					<div>
						<h3 class="font-medium">Clean Data</h3>
						<p class="text-sm text-gray-500">Fix quality issues</p>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
{/if}
