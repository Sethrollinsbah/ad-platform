<script lang="ts">
	import { siteContent } from '$lib/data/site-content';
	import PricingCalculator from './pricing-calculator.svelte';
	import PricingCard from './pricing-card.svelte';

	const { pricingData } = siteContent;

	// State for highlighted plan
	let highlightedPlan = $state('');
</script>

<!-- Pricing Section -->
<section id="pricing" class="bg-amber-50 py-24">
	<div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="text-4xl font-extrabold">{pricingData.title}</h2>
			<p class="mt-4 text-xl">{pricingData.subtitle}</p>
			<p class="mt-2 text-gray-600">Only pay for the impressions your ads actually receive</p>
		</div>

		<!-- Budget Calculator -->
		<PricingCalculator {pricingData} />

		<!-- Pricing Cards -->
		<div class="grid gap-8 lg:grid-cols-3">
			{#each pricingData.plans as plan}
				<PricingCard {plan} {highlightedPlan} />
			{/each}
		</div>

		<!-- CPM Explanation -->
		<div
			class="mx-auto mt-16 max-w-3xl rounded-lg border-2 border-black bg-blue-100 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
		>
			<h3 class="text-xl font-bold">What is CPM?</h3>
			<p class="mt-2">
				CPM stands for "Cost Per Mille" (cost per thousand impressions). With our transparent CPM
				pricing, you only pay when your ads are actually seen by potential customers. This means
				more efficient spending and better ROI compared to flat-fee advertising.
			</p>
			<p class="mt-2">
				<strong>Example:</strong> At $12.50 CPM, you pay just $12.50 for every 1,000 people who see your
				restaurant ads. The more visible your restaurant becomes, the more hungry customers walk through
				your door!
			</p>
		</div>
	</div>
</section>
