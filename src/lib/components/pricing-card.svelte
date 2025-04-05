<script lang="ts">
	import { createSmoothScrollHandler } from '@/lib/utils/scroll';
	import { onMount } from 'svelte';

	// Define props for the pricing card
	interface PricingCardProps {
		plan: {
			id: string;
			name: string;
			badge: string;
			price: string;
			cpmValue: number;
			period: string;
			details: string;
			minBudget: number;
			features: string[];
			impressions: number;
			savings: string;
			isPopular?: boolean;
		};
		highlightedPlan?: string;
	}

	let { plan, highlightedPlan = '' } = $props() as PricingCardProps;

	// Initialize smooth scroll handler
	let handleNavClick = $state<(e: MouseEvent) => void | undefined>(undefined);

	onMount(() => {
		handleNavClick = createSmoothScrollHandler(100);
	});
</script>

<div
	class="relative mx-auto max-w-sm {plan.isPopular
		? 'z-10 -mt-4 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] md:-mb-4 md:mt-0'
		: highlightedPlan === plan.id
			? 'border-green-500 shadow-[8px_8px_0px_0px_rgba(34,197,94,1)]'
			: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'} {highlightedPlan && highlightedPlan !== plan.id
		? 'opacity-50'
		: ''} overflow-hidden rounded-lg border-4 border-black bg-white p-8 transition-all duration-300"
>
	{#if highlightedPlan === plan.id && !plan.isPopular}
		<div class="-translate-y-12 translate-x-20 rotate-45">
			<div
				class="absolute -right-12 -top-1 transform border-2 border-black bg-green-500 px-12 py-1 font-bold text-white"
			>
				RECOMMENDED
			</div>
		</div>
	{:else if plan.isPopular}
		<div class="-translate-y-14 translate-x-20 rotate-45">
			<div
				class="absolute -right-12 -top-1 transform border-2 border-black bg-red-500 px-20 py-1 font-bold text-white"
			>
				{plan.badge}
			</div>
		</div>
	{:else}
		<div
			class="absolute right-0 top-0 border-b-2 border-l-2 border-black bg-gray-200 px-4 py-1 font-bold"
		>
			{plan.badge}
		</div>
	{/if}
	<h3 class="mb-3 mt-8 text-2xl font-bold">{plan.name}</h3>

	<div class="mb-2">
		<div class="flex items-baseline">
			<span class="text-5xl font-extrabold text-red-500">{plan.price}</span>
			<span class="ml-1 text-xl font-bold text-gray-700">{plan.period}</span>
		</div>
		<div class="mt-1 text-sm text-gray-600">{plan.details}</div>
	</div>

	<div
		class="mb-4 mt-2 inline-block rounded-lg bg-green-100 px-3 py-1 text-sm font-bold text-green-800"
	>
		{plan.savings}
	</div>

	<ul class="mb-8 space-y-3">
		{#each plan.features as feature}
			<li class="flex items-start">
				<span class="mr-2 text-green-500">✓</span>
				{feature}
			</li>
		{/each}
	</ul>

	<a
		href="#contact"
		class="block w-full rounded-lg border-2 border-black {plan.isPopular
			? 'bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
			: highlightedPlan === plan.id
				? 'bg-green-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
				: 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]'} px-6 py-3 text-center font-bold transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]"
		onclick={handleNavClick}
	>
		Get Started
	</a>
</div>
