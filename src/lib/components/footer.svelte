<script lang="ts">
	import { siteContent } from '$lib/data/site-content';
	import Logo from './logo.svelte';
	import FooterLinksSection from './footer-links-section.svelte';
	import FooterSocialIcons from './footer-social-icons.svelte';

	const { footer, companyName } = siteContent;
</script>

<!-- Footer -->
<footer class="border-t-4 border-black bg-black py-16 text-white">
	<div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
		<div class="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
			<div>
				<Logo />
				<p class="mt-4 text-gray-400">
					{footer.description}
				</p>
			</div>

			{#each footer.sections as section}
				<FooterLinksSection title={section.title} links={section.links} />
			{/each}

			<div>
				<h3 class="mb-4 text-xl font-bold">{footer.contact.title}</h3>
				<ul class="space-y-2 text-gray-400">
					<li>{footer.contact.email}</li>
					<li>{footer.contact.phone}</li>
					{#each footer.contact.address as line}
						<li>{line}</li>
					{/each}
				</ul>
			</div>
		</div>
		<div
			class="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row"
		>
			<div class="text-gray-500">{footer.copyright}</div>
			<div class="mt-4 flex space-x-6 md:mt-0">
				<FooterSocialIcons socialLinks={footer.socialLinks} />
			</div>
		</div>
	</div>
</footer>
