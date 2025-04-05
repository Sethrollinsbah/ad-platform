<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CampaignSettings } from '../dashboard-types';

	const dispatch = createEventDispatcher();

	// Define the props interface
	interface SettingsPanelProps {
		settings?: CampaignSettings;
	}

	// Use $props() for props in Svelte 5
	let {
		settings = {
			budget: 750,
			duration: 30,
			primaryGoal: 'website',
			secondaryGoal: 'calls'
		}
	} = $props() as SettingsPanelProps;

	// Use $effect for reactive behavior instead of $: block
	$effect(() => {
		dispatch('update', settings);
	});
</script>

<div class="h-full bg-white p-4 shadow-inner">
	<h3 class="mb-2 font-semibold">Campaign Settings</h3>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div>
			<label class="mb-1 block text-xs font-medium text-gray-700">Budget</label>
			<div class="flex items-center">
				<span class="mr-2 text-gray-500">$</span>
				<input
					type="range"
					min="500"
					max="2000"
					step="50"
					bind:value={settings.budget}
					class="w-full accent-red-500"
				/>
				<span class="ml-2">${settings.budget}</span>
			</div>
		</div>

		<div>
			<label class="mb-1 block text-xs font-medium text-gray-700">Duration</label>
			<select
				bind:value={settings.duration}
				class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200"
			>
				<option value={7}>7 days</option>
				<option value={14}>14 days</option>
				<option value={30}>30 days</option>
				<option value={60}>60 days</option>
				<option value={90}>90 days</option>
			</select>
		</div>
	</div>

	<slot></slot>
</div>
