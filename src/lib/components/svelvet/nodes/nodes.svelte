<script lang="ts">
	import CampaignNode from './campaign-node.svelte';
	import DbTable from './db-table.svelte';
	import PlatformNode from './platform-node.svelte';

	let {
		type = 'campaign',
		data,
		campaignId = 'weekend-special',
		campaignPositionX = -400,
		campaignPositionY = -200,
		campaignName = 'Weekend Special',
		campaignStatus = 'Active',
		campaignBudget = 1200,
		campaignImpressions = 45000,
		campaignClicks = 2250,
		campaignConversions = 180,
		campaignStartDate = '2025-03-15',
		campaignEndDate = '2025-04-15',
		campaignMainColor = '#FF5252',
		campaignShadowColor = '#FF9999',
		platformId = 'instagram-channel',
		platformPositionX = 800,
		platformPositionY = 200,
		platformName = 'Instagram',
		platformType = 'Social',
		platformIcon = '📸',
		platformBudget = 450,
		platformBudgetPercentage = 35,
		platformImpressions = 22500,
		platformClicks = 1125,
		platformConversions = 90,
		platformCostPerClick = 0.4,
		platformCostPerConversion = 5.0,
		platformMainColor = '#E1306C',
		platformShadowColor = '#F5A3C7',
		tableId = 'people',
		tablePositionX = -300,
		tablePositionY = -300,
		tableHeadingText = 'People',
		tableHeadingColor = '#4285F4',
		tableBorderColor = '#000000',
		tableShadowColor = '#99C9FF',
		tableData = [
			{ field: 'id', type: 'bigint', constraint: 'autoincrement()' },
			{ field: 'mass', type: 'int', constraint: '' }
		]
	} = $props();
</script>

{#if type === 'campaign'}
	<CampaignNode
		id={campaignId}
		positionX={campaignPositionX}
		positionY={campaignPositionY}
		{campaignName}
		{campaignStatus}
		budget={campaignBudget}
		impressions={campaignImpressions}
		clicks={campaignClicks}
		conversions={campaignConversions}
		startDate={campaignStartDate}
		endDate={campaignEndDate}
		mainColor={campaignMainColor}
		shadowColor={campaignShadowColor}
	/>
{:else if type === 'platform'}
	<PlatformNode
		id={platformId}
		positionX={platformPositionX}
		positionY={platformPositionY}
		{platformName}
		{platformType}
		{platformIcon}
		budget={platformBudget}
		budgetPercentage={platformBudgetPercentage}
		impressions={platformImpressions}
		clicks={platformClicks}
		conversions={platformConversions}
		costPerClick={platformCostPerClick}
		costPerConversion={platformCostPerConversion}
		mainColor={platformMainColor}
		shadowColor={platformShadowColor}
	/>
{:else if type === 'table'}
	<DbTable
		id={tableId}
		positionX={tablePositionX}
		positionY={tablePositionY}
		headingText={tableHeadingText}
		headingColor={tableHeadingColor}
		borderColor={tableBorderColor}
		shadowColor={tableShadowColor}
		{tableData}
		{data}
	/>
{/if}
