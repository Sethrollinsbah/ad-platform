<script lang="ts">
	import { createSmoothScrollHandler } from '$lib/utils/scroll';
	import { onMount } from 'svelte';
	import Logo from './logo.svelte';
	import type { NavLink } from '$lib/data/site-content';

	// Props for navigation
	interface HeroNavigationProps {
		navLinks: NavLink[];
		ctaButton: {
			text: string;
			href: string;
		};
		isScrolled: boolean;
	}

	let { 
		navLinks, 
		ctaButton, 
		isScrolled = false 
	} = $props() as HeroNavigationProps;

	// Initialize smooth scroll handler
	let handleNavClick = $state<(e: MouseEvent) => void | undefined>(undefined);

	onMount(() => {
		// Create a handler with 70px offset to account for the sticky header
		handleNavClick = createSmoothScrollHandler(70);
	});
</script>

<nav
	class="{isScrolled
		? 'fixed left-0 right-0 top-0 z-50 border-b-2 border-black bg-white px-4 py-4 shadow-md md:px-6 lg:px-8'
		: ''} mx-auto flex items-center justify-between py-6 transition-all duration-300"
>
	<div class="flex items-center gap-3">
		<a
			href={'#main'}
			class="font-bold transition-colors hover:text-red-500"
			onclick={handleNavClick}
		>
			<Logo />
		</a>
	</div>
	<div class="hidden items-center gap-8 md:flex">
		{#each navLinks as link}
			<a
				href={link.href}
				class="font-bold transition-colors hover:text-red-500"
				onclick={handleNavClick}
			>
				{link.text}
			</a>
		{/each}
	</div>
	<div>
		<a
			href={ctaButton.href}
			class="rounded-lg border-2 border-black bg-black px-6 py-3 font-bold text-white shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]"
			onclick={handleNavClick}
		>
			{ctaButton.text}
		</a>
	</div>
</nav>
