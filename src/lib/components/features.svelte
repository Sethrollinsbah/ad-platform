<script lang="ts">
	import { siteContent } from '$lib/data/site-content';
	import FeatureCard from './feature-card.svelte';

	const { features } = siteContent;
</script>

<!-- Features Section -->
<section id="features" class="bg-amber-50 py-24">
	<div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="text-4xl font-extrabold">{features.title}</h2>
			<p class="mt-4 text-xl">{features.subtitle}</p>
		</div>

		<div class="grid gap-12 md:grid-cols-3">
			{#each features.items as feature}
				<FeatureCard
					icon={feature.icon}
					title={feature.title}
					description={feature.description}
					color={feature.color}
				/>
			{/each}
		</div>
	</div>
</section>
