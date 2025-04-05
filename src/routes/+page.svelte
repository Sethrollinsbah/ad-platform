<!-- src/routes/+page.svelte -->
<script lang="ts">
	import Contact from '@/lib/components/contact.svelte';
	import Features from '@/lib/components/features.svelte';
	import Footer from '@/lib/components/footer.svelte';
	import Hero from '@/lib/components/hero.svelte';
	import HowItWorks from '@/lib/components/how-it-works.svelte';
	import Pricing from '@/lib/components/pricing.svelte';
	import Stats from '@/lib/components/stats.svelte';
	import Testimonials from '@/lib/components/testimonials.svelte';
	import SEOHead from '$lib/components/seo/head.svelte';
	import { siteContent } from '$lib/data/site-content';
	import { onMount } from 'svelte';

	// Extract content for SEO
	const { hero } = siteContent;

	// You can add interactive functionality here
	let isScrolled = $state(false);

	// Handle scroll for sticky header effect
	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<!-- Page-specific SEO overrides -->
<SEOHead
	title="ResAds | Sizzling Restaurant Ads That Drive Hungry Customers To Your Door"
	description={hero.description}
	canonical="https://resads.com"
	ogImage="https://resads.com/images/restaurant-ad-showcase.jpg"
/>

<div class="min-h-screen bg-amber-50">
	<Hero {isScrolled}></Hero>
	<Stats></Stats>
	<Features></Features>
	<HowItWorks></HowItWorks>
	<Pricing></Pricing>
	<Testimonials></Testimonials>
	<Contact></Contact>
	<Footer></Footer>
</div>

<svelte:head>
	<!-- Structured data specific to the homepage -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "ResAds - Restaurant Advertising That Works",
			"description": "${hero.description}",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "https://resads.com"
			},
			"offers": {
				"@type": "AggregateOffer",
				"priceCurrency": "USD",
				"lowPrice": "499",
				"highPrice": "1499",
				"offerCount": "3"
			}
		}
	</script>
</svelte:head>
