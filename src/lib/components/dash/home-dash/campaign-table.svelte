<script lang="ts">
	 let {campaignPerformance = []}= $props()
</script>

<div class="col-span-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
	<h2 class="mb-4 text-lg font-bold">Campaign Breakdown</h2>
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-gray-200">
			<thead>
				<tr>
					<th
						class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Campaign
					</th>
					<th
						class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Impressions
					</th>
					<th
						class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Clicks
					</th>
					<th
						class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						CTR
					</th>
					<th
						class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Conversions
					</th>
					<th
						class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Cost
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each campaignPerformance as campaign, index}
					<tr class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
						<td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
							{campaign.name}
						</td>
						<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
							{campaign.impressions.toLocaleString()}
						</td>
						<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
							{campaign.clicks.toLocaleString()}
						</td>
						<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
							{campaign.ctr.toFixed(1)}%
						</td>
						<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
							{campaign.conversions}
						</td>
						<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
							${campaign.cost}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
