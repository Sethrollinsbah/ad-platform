<!-- src/routes/dash/campaigns/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Search,
		Filter,
		Plus,
		MoreVertical,
		Play,
		Pause,
		Pencil,
		Trash,
		ArrowUpRight,
		BarChart
	} from 'lucide-svelte';

	// Import shadcn-svelte components
	import * as Card from '$lib/components/ui/card';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Button from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Badge } from '$lib/components/ui/badge';
	import * as Input from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Separator from '$lib/components/ui/separator';
	import * as Progress from '$lib/components/ui/progress';

	import { cn } from '$lib/utils';

	// Campaign statuses and their labels
	const statuses = {
		active: { label: 'Active' },
		paused: { label: 'Paused' },
		scheduled: { label: 'Scheduled' },
		ended: { label: 'Ended' }
	};

	// Sample campaign data
	let campaigns = $state([
		{
			id: 1,
			name: 'Weekend Special Promotion',
			status: 'active',
			budget: 1200,
			spent: 487.25,
			impressions: 42350,
			clicks: 2118,
			ctr: 5.0,
			startDate: '2025-03-01',
			endDate: '2025-03-31'
		},
		{
			id: 2,
			name: 'Lunch Deal Campaign',
			status: 'active',
			budget: 800,
			spent: 312.4,
			impressions: 28750,
			clicks: 1438,
			ctr: 5.0,
			startDate: '2025-03-10',
			endDate: '2025-04-10'
		},
		{
			id: 3,
			name: 'Happy Hour Promotion',
			status: 'paused',
			budget: 650,
			spent: 215.8,
			impressions: 18200,
			clicks: 910,
			ctr: 5.0,
			startDate: '2025-02-15',
			endDate: '2025-03-15'
		},
		{
			id: 4,
			name: 'New Menu Launch',
			status: 'scheduled',
			budget: 1500,
			spent: 0,
			impressions: 0,
			clicks: 0,
			ctr: 0,
			startDate: '2025-04-01',
			endDate: '2025-05-01'
		},
		{
			id: 5,
			name: "Valentine's Day Special",
			status: 'ended',
			budget: 500,
			spent: 500,
			impressions: 35200,
			clicks: 1760,
			ctr: 5.0,
			startDate: '2025-02-01',
			endDate: '2025-02-14'
		}
	]);

	// Filter state
	let searchQuery = $state('');
	let statusFilter = $state('all');
	let drawerOpen = $state(false);
	let selectedCampaign = $state(null);

	// Action menu state for mobile
	let actionMenuOpen = $state(null);

	// Filtering function
	$effect(() => {
		filteredCampaigns = campaigns.filter((campaign) => {
			const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	});
	let filteredCampaigns = $state([...campaigns]);

	// Toggle campaign status
	function toggleCampaignStatus(id) {
		campaigns = campaigns.map((campaign) => {
			if (campaign.id === id) {
				return {
					...campaign,
					status: campaign.status === 'active' ? 'paused' : 'active'
				};
			}
			return campaign;
		});
	}

	// Open campaign details drawer
	function openCampaignDetails(campaign) {
		selectedCampaign = campaign;
		drawerOpen = true;
	}

	// Toggle action menu for mobile
	function toggleActionMenu(id) {
		actionMenuOpen = actionMenuOpen === id ? null : id;
	}

	// Format numbers
	function formatNumber(num) {
		return new Intl.NumberFormat().format(num);
	}

	// Format budget as currency
	function formatCurrency(amount) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(amount);
	}

	// Calculate budget utilization percentage
	function getBudgetUtilization(spent, budget) {
		return Math.min(Math.round((spent / budget) * 100), 100);
	}
</script>

<div class="container mx-auto p-4 md:p-6">
	<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Campaigns</h1>
		<Button.Root href="/dash/new" variant="default" class="mt-4 sm:mt-0">
			<Plus class="mr-2 h-4 w-4" />
			New Campaign
		</Button.Root>
	</div>

	<!-- Filters and search -->
	<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div class="flex max-w-md flex-1 flex-col gap-4 sm:flex-row">
			<!-- Search box -->
			<div class="relative flex-1">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input.Root
					type="text"
					bind:value={searchQuery}
					placeholder="Search campaigns..."
					class="pl-10"
				/>
			</div>

			<!-- Status filter -->
			<div class="w-full sm:w-40">
				<Select.Root value={statusFilter} onSelectedChange={(val) => (statusFilter = val)}>
					<Select.Trigger class="w-full">
						<Select.Value placeholder="Filter by status" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="all">All Status</Select.Item>
						<Select.Item value="active">Active</Select.Item>
						<Select.Item value="paused">Paused</Select.Item>
						<Select.Item value="scheduled">Scheduled</Select.Item>
						<Select.Item value="ended">Ended</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<div class="flex items-center text-sm text-gray-500">
			<span
				>{filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found</span
			>
		</div>
	</div>

	<!-- Campaigns list - Desktop version (hidden on small screens) -->
	<div class="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:block">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th
						class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Campaign
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Status
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Budget
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Performance
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Duration
					</th>
					<th
						class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Actions
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each filteredCampaigns as campaign}
					<tr class="hover:bg-gray-50">
						<td class="whitespace-nowrap px-6 py-4">
							<div class="font-medium text-gray-900">{campaign.name}</div>
							<div class="text-sm text-gray-500">ID: {campaign.id}</div>
						</td>
						<td class="whitespace-nowrap px-6 py-4">
							<Badge
								variant={campaign.status === 'active'
									? 'success'
									: campaign.status === 'paused'
										? 'warning'
										: campaign.status === 'scheduled'
											? 'info'
											: 'secondary'}
							>
								{statuses[campaign.status].label}
							</Badge>
						</td>
						<td class="whitespace-nowrap px-6 py-4">
							<div class="font-medium">{formatCurrency(campaign.budget)}</div>
							<div class="mt-1 flex items-center text-xs">
								<Progress.Root
									value={getBudgetUtilization(campaign.spent, campaign.budget)}
									class="h-1.5 w-24"
									indicatorClass={campaign.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}
								/>
								<span class="ml-2 text-gray-500">{formatCurrency(campaign.spent)} spent</span>
							</div>
						</td>
						<td class="whitespace-nowrap px-6 py-4">
							<div class="flex items-center justify-between">
								<div>
									<div class="font-medium">{formatNumber(campaign.impressions)}</div>
									<div class="text-xs text-gray-500">Impressions</div>
								</div>
								<div class="mx-4 text-gray-300">|</div>
								<div>
									<div class="font-medium">{formatNumber(campaign.clicks)}</div>
									<div class="text-xs text-gray-500">Clicks</div>
								</div>
								<div class="mx-4 text-gray-300">|</div>
								<div>
									<div class="font-medium">{campaign.ctr.toFixed(1)}%</div>
									<div class="text-xs text-gray-500">CTR</div>
								</div>
							</div>
						</td>
						<td class="whitespace-nowrap px-6 py-4">
							<div>{new Date(campaign.startDate).toLocaleDateString()}</div>
							<div class="text-xs text-gray-500">
								to {new Date(campaign.endDate).toLocaleDateString()}
							</div>
						</td>
						<td class="whitespace-nowrap px-6 py-4 text-right">
							<div class="flex justify-end space-x-2">
								<Button.Root
									variant="ghost"
									size="icon"
									class={campaign.status === 'active' ? 'text-amber-500' : 'text-green-500'}
									on:click={() => toggleCampaignStatus(campaign.id)}
									disabled={campaign.status === 'ended' || campaign.status === 'scheduled'}
									title={campaign.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
								>
									{#if campaign.status === 'active'}
										<Pause class="h-5 w-5" />
									{:else}
										<Play class="h-5 w-5" />
									{/if}
								</Button.Root>

								<Button.Root
									variant="ghost"
									size="icon"
									class="text-blue-500"
									on:click={() => openCampaignDetails(campaign)}
									title="View Analytics"
								>
									<BarChart class="h-5 w-5" />
								</Button.Root>

								<Button.Root variant="ghost" size="icon" title="Edit Campaign">
									<Pencil class="h-5 w-5" />
								</Button.Root>
							</div>
						</td>
					</tr>
				{/each}

				{#if filteredCampaigns.length === 0}
					<tr>
						<td colspan="6" class="px-6 py-10 text-center text-gray-500">
							No campaigns found matching your criteria
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Campaigns cards - Mobile version (visible only on small screens) -->
	<div class="space-y-4 md:hidden">
		{#each filteredCampaigns as campaign}
			<Card.Root>
				<Card.Content class="p-4">
					<div class="flex items-center justify-between">
						<Badge
							variant={campaign.status === 'active'
								? 'success'
								: campaign.status === 'paused'
									? 'warning'
									: campaign.status === 'scheduled'
										? 'info'
										: 'secondary'}
						>
							{statuses[campaign.status].label}
						</Badge>

						<!-- Dropdown menu -->
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button.Root variant="ghost" size="icon" builders={[builder]}>
									<MoreVertical class="h-5 w-5" />
								</Button.Root>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								{#if campaign.status !== 'ended' && campaign.status !== 'scheduled'}
									<DropdownMenu.Item on:click={() => toggleCampaignStatus(campaign.id)}>
										{#if campaign.status === 'active'}
											<Pause class="mr-2 h-4 w-4 text-amber-500" />
											<span>Pause Campaign</span>
										{:else}
											<Play class="mr-2 h-4 w-4 text-green-500" />
											<span>Activate Campaign</span>
										{/if}
									</DropdownMenu.Item>
								{/if}
								<DropdownMenu.Item on:click={() => openCampaignDetails(campaign)}>
									<BarChart class="mr-2 h-4 w-4 text-blue-500" />
									<span>View Analytics</span>
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<Pencil class="mr-2 h-4 w-4" />
									<span>Edit Campaign</span>
								</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<DropdownMenu.Item class="text-red-600">
									<Trash class="mr-2 h-4 w-4" />
									<span>Delete Campaign</span>
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>

					<h3 class="mt-2 text-lg font-medium text-gray-900">{campaign.name}</h3>

					<div class="mt-3 flex justify-between text-sm">
						<div>
							<div class="font-medium text-gray-900">{formatCurrency(campaign.budget)}</div>
							<div class="text-gray-500">Budget</div>
						</div>
						<div>
							<div class="text-right font-medium text-gray-900">
								{formatCurrency(campaign.spent)}
							</div>
							<div class="text-right text-gray-500">Spent</div>
						</div>
					</div>

					<Progress.Root
						value={getBudgetUtilization(campaign.spent, campaign.budget)}
						class="mt-2"
						indicatorClass={campaign.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}
					/>

					<div class="mt-4 grid grid-cols-3 gap-2 border-t border-gray-200 pt-4">
						<div class="text-center">
							<div class="font-medium">{formatNumber(campaign.impressions)}</div>
							<div class="text-xs text-gray-500">Impressions</div>
						</div>
						<div class="text-center">
							<div class="font-medium">{formatNumber(campaign.clicks)}</div>
							<div class="text-xs text-gray-500">Clicks</div>
						</div>
						<div class="text-center">
							<div class="font-medium">{campaign.ctr.toFixed(1)}%</div>
							<div class="text-xs text-gray-500">CTR</div>
						</div>
					</div>

					<div class="mt-4 border-t border-gray-200 pt-4 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-500">Duration:</span>
							<span>
								{new Date(campaign.startDate).toLocaleDateString()} -
								{new Date(campaign.endDate).toLocaleDateString()}
							</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}

		{#if filteredCampaigns.length === 0}
			<div
				class="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm"
			>
				No campaigns found matching your criteria
			</div>
		{/if}
	</div>
</div>

<!-- Campaign details drawer -->
<Drawer.Root bind:open={drawerOpen} snapPoints={['90%']}>
	<Drawer.Portal>
		<Drawer.Overlay />
		<Drawer.Content class="bg-white px-4">
			<Drawer.Header>
				<Drawer.Title>Campaign Details</Drawer.Title>
				<Drawer.Description>
					{selectedCampaign?.name || 'Campaign information'}
				</Drawer.Description>
			</Drawer.Header>

			{#if selectedCampaign}
				<div class="space-y-6 px-4">
					<!-- Status badge -->
					<div class="flex justify-between">
						<Badge
							variant={selectedCampaign.status === 'active'
								? 'success'
								: selectedCampaign.status === 'paused'
									? 'warning'
									: selectedCampaign.status === 'scheduled'
										? 'info'
										: 'secondary'}
						>
							{statuses[selectedCampaign.status].label}
						</Badge>
						<span class="text-sm text-gray-500">ID: {selectedCampaign.id}</span>
					</div>

					<!-- Budget information -->
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-base">Budget Information</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="flex justify-between">
								<div>
									<div class="text-2xl font-bold">{formatCurrency(selectedCampaign.budget)}</div>
									<div class="text-sm text-gray-500">Total Budget</div>
								</div>
								<div class="text-right">
									<div class="text-2xl font-bold">{formatCurrency(selectedCampaign.spent)}</div>
									<div class="text-sm text-gray-500">Amount Spent</div>
								</div>
							</div>

							<div class="mt-3">
								<div class="flex items-center justify-between text-sm">
									<span>Budget Utilization</span>
									<span
										>{getBudgetUtilization(selectedCampaign.spent, selectedCampaign.budget)}%</span
									>
								</div>
								<Progress.Root
									value={getBudgetUtilization(selectedCampaign.spent, selectedCampaign.budget)}
									class="mt-1"
								/>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Performance metrics -->
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-base">Performance Metrics</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid grid-cols-3 gap-4">
								<div class="rounded-lg bg-muted p-3 text-center">
									<div class="text-2xl font-bold">{formatNumber(selectedCampaign.impressions)}</div>
									<div class="text-sm text-muted-foreground">Impressions</div>
								</div>
								<div class="rounded-lg bg-muted p-3 text-center">
									<div class="text-2xl font-bold">{formatNumber(selectedCampaign.clicks)}</div>
									<div class="text-sm text-muted-foreground">Clicks</div>
								</div>
								<div class="rounded-lg bg-muted p-3 text-center">
									<div class="text-2xl font-bold">{selectedCampaign.ctr.toFixed(1)}%</div>
									<div class="text-sm text-muted-foreground">CTR</div>
								</div>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Campaign duration -->
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-base">Campaign Duration</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="flex justify-between">
								<div>
									<div class="font-medium">
										{new Date(selectedCampaign.startDate).toLocaleDateString()}
									</div>
									<div class="text-sm text-muted-foreground">Start Date</div>
								</div>
								<div class="text-right">
									<div class="font-medium">
										{new Date(selectedCampaign.endDate).toLocaleDateString()}
									</div>
									<div class="text-sm text-muted-foreground">End Date</div>
								</div>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Action buttons -->
					<div class="flex space-x-3">
						<Button.Root variant="outline" class="flex-1">Edit Campaign</Button.Root>
						{#if selectedCampaign.status !== 'ended' && selectedCampaign.status !== 'scheduled'}
							<Button.Root
								class="flex-1"
								on:click={() => toggleCampaignStatus(selectedCampaign.id)}
							>
								{selectedCampaign.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
							</Button.Root>
						{/if}
					</div>
				</div>
			{/if}

			<Drawer.Footer>
				<Drawer.Close asChild>
					<Button.Root variant="secondary" class="w-full">Close</Button.Root>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
