<script lang="ts">
	import { siteContent } from '$lib/data/site-content';
	import HeroNavigation from './hero-navigation.svelte';
	import HeroHeadline from './hero-headline.svelte';
	import HeroImage from './hero-image.svelte';

	const { hero, nav } = siteContent;

	// State for scroll tracking
	let isScrolled = $state(false);

	// Scroll event handler
	function handleScroll() {
		isScrolled = window.scrollY > 20;
	}
</script>

<svelte:window on:scroll={handleScroll} />

<!-- Hero Section -->
<header class="relative overflow-hidden px-4 pb-20 pt-12 md:px-6 lg:px-8">
	<!-- Navigation -->
	<HeroNavigation navLinks={nav.links} ctaButton={nav.ctaButton} {isScrolled} />

	<!-- Main Content -->
	<div id="main" class="mx-auto mt-16 max-w-7xl">
		<div class="grid items-center gap-12 md:grid-cols-2">
			<div>
				<HeroHeadline headline={hero.headline} description={hero.description} cta={hero.cta} />
			</div>
			<div class="relative">
				<HeroImage
					imageSrc="https://images.pexels.com/photos/3801426/pexels-photo-3801426.jpeg?auto=compress&cs=tinysrgb&w=1600"
					imageAlt="Restaurant advertisement example"
				/>
			</div>
		</div>
	</div>
</header>
