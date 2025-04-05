<script lang="ts">
	import { createSmoothScrollHandler } from '@/lib/utils/scroll';
	import { onMount } from 'svelte';

	// Props for footer links section
	interface FooterLinksSectionProps {
		title: string;
		links: Array<{
			text: string;
			href: string;
		}>;
	}

	let { title, links } = $props() as FooterLinksSectionProps;

	// Initialize smooth scroll handler
	let handleNavClick = $state<(e: MouseEvent) => void | undefined>(undefined);

	onMount(() => {
		handleNavClick = createSmoothScrollHandler(100);
	});
</script>

<div>
	<h3 class="mb-4 text-xl font-bold">{title}</h3>
	<ul class="space-y-2">
		{#each links as link}
			<li>
				<a onclick={handleNavClick} href={link.href} class="text-gray-400 hover:text-white">
					{link.text}
				</a>
			</li>
		{/each}
	</ul>
</div>
