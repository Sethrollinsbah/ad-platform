<script lang="ts">
	import { siteContent } from '$lib/data/site-content';
	import HowItWorksStep from './how-it-works-step.svelte';

	const { howItWorks } = siteContent;
</script>

<!-- How It Works Section -->
<section id="howItWorks" class="border-y-4 border-black bg-blue-400 py-24">
	<div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="text-4xl font-extrabold">{howItWorks.title}</h2>
			<p class="mt-4 text-xl">{howItWorks.subtitle}</p>
		</div>

		<div class="grid gap-8 md:grid-cols-4">
			{#each howItWorks.steps as step}
				<HowItWorksStep number={step.number} title={step.title} description={step.description} />
			{/each}
		</div>
	</div>
</section>
