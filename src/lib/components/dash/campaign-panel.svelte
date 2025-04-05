<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { settingsPanel } from '@/lib';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Overview from './campaign-panel/overview.svelte';
	import Settings from './campaign-panel/settings.svelte';
	import Data from './campaign-panel/data.svelte';
	import Badge from '../ui/badge/badge.svelte';
	import ApprovedLogos from './approved-logos.svelte';
	let campPanel = $state([
		{
			name: 'Overview',
			code: Overview
		},
		{
			name: 'Settings',
			code: Settings
		}
	]);

	$effect(() => {
		if ($settingsPanel.type === 'campaign') {
			campPanel = [
				{
					name: 'Overview',
					code: Overview
				},
				{
					name: 'Settings',
					code: Settings
				}
			];
		} else if ($settingsPanel.type === 'table') {
			campPanel = [
				{
					name: 'Overview',
					code: Overview
				},
				{
					name: 'Data',
					code: Data
				},
				{
					name: 'Settings',
					code: Settings
				}
			];
		} else if ($settingsPanel.type === 'platform') {
			campPanel = [
				{
					name: 'Overview',
					code: Overview
				},
				{
					name: 'Settings',
					code: Settings
				}
			];
		}
	});
</script>

{#if $settingsPanel.id !== null}
	<div
		class="fixed bottom-0 right-0 h-[80dvh] w-[calc(100vw-1rem)] w-full overflow-y-auto rounded-tl-lg bg-white shadow-lg ring-1 ring-black md:w-[60vw]"
		transition:fly={{
			x: 100,
			y: 100,
			duration: 300,
			easing: quintOut
		}}
	>
		<div class="relative h-full w-full overflow-y-auto">
			<Tabs.Root value="overview" class=" sticky w-full">
				<div class="sticky top-0 flex w-full flex-col justify-between bg-background pb-4 pt-12">
					<div class="flex h-fit w-full flex-row px-12">
						<ApprovedLogos int={$settingsPanel.type}></ApprovedLogos>
						<div class="w-full">
							<h2 class="w-full text-2xl font-bold capitalize">
								{$settingsPanel.id.split('---')[1] ?? $settingsPanel.id}
							</h2>
							<Badge class="capitalize" variant="outline">{$settingsPanel.type}</Badge>
						</div>
						<div>
							<button
								class=" flex w-6 items-center justify-end"
								onclick={() => {
									$settingsPanel = { id: null, type: null, icon: null, data: null };
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-6 w-6"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>
					<Tabs.List class="flex w-full flex-row justify-start bg-transparent px-12">
						{#each campPanel as s}
							<Tabs.Trigger
								class="border-red-500 text-primary/50 data-[state=active]:text-primary "
								value={s.name.toLowerCase()}>{s.name}</Tabs.Trigger
							>
						{/each}
					</Tabs.List>
				</div>
				<div class="overflow-y-auto border-t-[1px] border-accent px-12">
					{#each campPanel as s}
						<Tabs.Content value={s.name.toLowerCase()}
							><svelte:component this={s.code}></svelte:component></Tabs.Content
						>
					{/each}
				</div>
			</Tabs.Root>
		</div>
	</div>
{/if}
