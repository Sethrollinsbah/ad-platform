<script lang="ts">
	import { siteContent } from '$lib/data/site-content';
	import StatCard from './stat-card.svelte';

	const { stats } = siteContent;
</script>

<!-- Stats Section -->
<section class="border-y-4 border-black bg-red-500 py-16">
	<div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
		<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
			{#each stats as stat}
				<StatCard value={stat.value} label={stat.label} />
			{/each}
		</div>
	</div>
</section>
