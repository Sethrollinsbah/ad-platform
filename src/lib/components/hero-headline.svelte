<script lang="ts">
	import { createSmoothScrollHandler } from '$lib/utils/scroll';
	import { onMount } from 'svelte';

	// Props for hero headline
	interface HeroHeadlineProps {
		headline: {
			prefix: string;
			highlight: string;
			suffix: string;
		};
		description: string;
		cta: {
			primary: string;
			secondary: string;
		};
	}

	let { headline, description, cta } = $props() as HeroHeadlineProps;

	// Initialize smooth scroll handler
	let handleNavClick = $state<(e: MouseEvent) => void | undefined>(undefined);

	onMount(() => {
		handleNavClick = createSmoothScrollHandler(70);
	});
</script>

<div>
	<h1 class="text-5xl font-extrabold leading-tight md:text-6xl">
		{headline.prefix}
		<span
			class="-mx-2 rounded-lg border-2 border-black bg-red-500 px-2 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
		>
			{headline.highlight}
		</span>
		{headline.suffix}
	</h1>
	<p class="mt-6 text-xl">
		{description}
	</p>
	<div class="mt-10 flex flex-wrap gap-4">
		<a
			href="#contact"
			class="rounded-lg border-2 border-black bg-red-500 px-8 py-4 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
			onclick={handleNavClick}
		>
			{cta.primary}
		</a>
		<a
			href="#howItWorks"
			class="rounded-lg border-2 border-black bg-white px-8 py-4 font-bold text-black shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]"
			onclick={handleNavClick}
		>
			{cta.secondary}
		</a>
	</div>
</div>
