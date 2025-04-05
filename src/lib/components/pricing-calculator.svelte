<script lang="ts">
	import { createSmoothScrollHandler } from '@/lib/utils/scroll';
	import { onMount } from 'svelte';

	// Budget calculator state
	let currentBudget = $state(750);
	let recommendedPlan = $state('');
	let estimatedImpressions = $state(0);
	let calculatorVisible = $state(false);
	let calculatorResult = $state(false);
	let highlightedPlan = $state('');

	// Initialize smooth scroll handler
	let handleNavClick = $state<(e: MouseEvent) => void | undefined>(undefined);

	onMount(() => {
		handleNavClick = createSmoothScrollHandler(100);
	});

	// Pricing data (passed as prop)
	let { pricingData } = $props();

	// Calculate recommended plan based on current budget
	function calculateRecommendation() {
		if (currentBudget < pricingData.plans[0].minBudget) {
			recommendedPlan = 'custom';
			estimatedImpressions = Math.floor((currentBudget / pricingData.plans[0].cpmValue) * 1000);
			calculatorResult = true;
			return;
		}

		// Find the best plan based on budget
		if (currentBudget >= pricingData.plans[2].minBudget) {
			recommendedPlan = pricingData.plans[2].id;
			estimatedImpressions = Math.floor((currentBudget / pricingData.plans[2].cpmValue) * 1000);
		} else if (currentBudget >= pricingData.plans[1].minBudget) {
			recommendedPlan = pricingData.plans[1].id;
			estimatedImpressions = Math.floor((currentBudget / pricingData.plans[1].cpmValue) * 1000);
		} else {
			recommendedPlan = pricingData.plans[0].id;
			estimatedImpressions = Math.floor((currentBudget / pricingData.plans[0].cpmValue) * 1000);
		}

		calculatorResult = true;
	}

	function toggleCalculator() {
		calculatorVisible = !calculatorVisible;
		if (!calculatorVisible) {
			calculatorResult = false;
		}
	}

	// Update highlighted plan when calculator result changes
	$effect(() => {
		if (calculatorResult) {
			highlightedPlan = recommendedPlan;
		} else {
			highlightedPlan = '';
		}
	});

	// Format number with commas
	function formatNumber(num: number): string {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
</script>

<div class="mb-12">
	<button
		class="mx-auto flex items-center rounded-lg border-2 border-black bg-blue-500 px-6 py-3 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
		onclick={toggleCalculator}
	>
		<span class="mr-2">{calculatorVisible ? 'Hide' : 'Show'} Budget Calculator</span>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	{#if calculatorVisible}
		<div
			class="mt-6 rounded-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]"
		>
			<h3 class="mb-4 text-xl font-bold">Find Your Perfect Ad Package</h3>
			<p class="mb-4">
				Enter your current monthly advertising budget to see which package would give you the best
				value.
			</p>

			<div class="mb-6">
				<label for="budget" class="mb-2 block font-bold">Monthly Budget ($)</label>
				<div class="flex items-center gap-4">
					<input
						type="range"
						id="budget"
						bind:value={currentBudget}
						min="300"
						max="2000"
						step="50"
						class="h-2 w-full appearance-none rounded-lg bg-gray-200 accent-red-500"
					/>
					<div
						class="flex min-w-24 items-center justify-center rounded-lg border-2 border-black bg-gray-100 px-3 py-2 font-bold"
					>
						${currentBudget}
					</div>
				</div>
			</div>

			<button
				onclick={calculateRecommendation}
				class="w-full rounded-lg border-2 border-black bg-red-500 px-6 py-3 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
			>
				Calculate Best Value
			</button>

			{#if calculatorResult}
				<div
					class:bg-green-100={recommendedPlan !== 'custom'}
					class:bg-red-100={recommendedPlan === 'custom'}
					class="mt-6 rounded-lg border-2 border-black p-4"
				>
					<h4 class="mb-2 text-lg font-bold">Your Recommendation</h4>
					{#if recommendedPlan === 'custom'}
						<p>Your budget is below our starter package. Contact us for a custom solution!</p>
					{:else}
						<p>
							Based on your ${currentBudget} budget, we recommend our
							<span class="font-bold text-red-500"
								>{pricingData.plans.find((p) => p.id === recommendedPlan)?.name}</span
							> package.
						</p>
						<p class="mt-2">
							This would give you approximately <span class="font-bold"
								>{formatNumber(estimatedImpressions)}</span
							> ad impressions per month.
						</p>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
