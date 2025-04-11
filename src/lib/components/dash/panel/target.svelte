<script>
	import { settingsPanel } from '@/lib';
	import TargetCampaign from './target-campaign.svelte';
	import TargetPlatform from './target-platform.svelte';
</script>

<!-- Campaign Overview -->
{#if $settingsPanel.type === 'campaign'}
	<TargetCampaign></TargetCampaign>
{:else if $settingsPanel.type === 'platform'}
	<TargetPlatform></TargetPlatform>
{/if}
