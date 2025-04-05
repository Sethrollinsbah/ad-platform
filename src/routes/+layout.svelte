<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import SEOHead from '$lib/components/seo/head.svelte';

	// import { Toaster } from '$lib/components/ui/sonner';
	// Import any other site-wide components or data
	import { siteContent } from '$lib/data/site-content';

	// You can set page-specific SEO data here or in individual page components
	const { companyName } = siteContent;

	// Extract child component props
	let { data, children } = $props();
</script>

<SEOHead />

<div class="flex min-h-screen flex-col">
	<main class="flex-1">
		{@render children()}
	</main>
</div>

<svelte:head>
	<!-- Preconnect to common third-party domains to improve performance -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<!-- You could add font loading or other resources here -->
</svelte:head>

<!-- <Toaster /> -->
