<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Search, Facebook, Instagram, Send, Store } from 'lucide-svelte';

	let {
		onBack = () => {},
		onSelect = (id: string) => {},
		platformTypes = [
			{
				id: 'google-ads',
				name: 'Google Ads',
				icon: Search,
				color: '#4285F4',
				description: 'Search engine advertising'
			},
			{
				id: 'meta-ads',
				name: 'Meta Ads',
				icon: Facebook,
				color: '#1877F2',
				description: 'Facebook & Instagram ads'
			},
			{
				id: 'instagram-ads',
				name: 'Instagram Ads',
				icon: Instagram,
				color: '#E1306C',
				description: 'Visual platform for food pics'
			},
			{
				id: 'email-marketing',
				name: 'Email Marketing',
				icon: Send,
				color: '#D54B3D',
				description: 'Direct email campaigns to customers'
			},
			{
				id: 'local-display',
				name: 'Local Display',
				icon: Store,
				color: '#34A853',
				description: 'Ads on local websites and apps'
			}
		]
	} = $props();
</script>

<div>
	<div class="mb-4">
		<Button variant="outline" size="sm" on:click={onBack}>← Back</Button>
	</div>

	<h3 class="mb-4 text-lg font-medium">Choose Advertising Platform</h3>

	<div class="grid gap-3">
		{#each platformTypes as platform}
			<Button
				variant="outline"
				class="flex h-auto items-start justify-start gap-3 p-3 text-left"
				on:click={() => onSelect(platform.id)}
			>
				<div
					class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
					style="background-color: {platform.color}25;"
				>
					<svelte:component this={platform.icon} class="h-5 w-5" style="color: {platform.color};" />
				</div>
				<div>
					<div class="font-medium">{platform.name}</div>
					<div class="text-sm text-gray-500">{platform.description}</div>
				</div>
			</Button>
		{/each}
	</div>
</div>
