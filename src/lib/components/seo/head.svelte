<!-- src/lib/components/seo/head.svelte -->
<script lang="ts">
	// Default SEO props that can be overridden by individual pages
	export let title = 'ResAds | Restaurant Advertising That Works';
	export let description =
		'We cook up mouth-watering ads that bring hungry customers to your restaurant. Our secret sauce? Eye-catching designs and targeted campaigns that work.';
	export let keywords =
		'restaurant advertising, restaurant marketing, food ads, restaurant social media, restaurant promotion, CPM ads';
	export let canonical = 'https://resads.planetbun.com';
	export let ogImage = '/business-card.png';
	export let ogType = 'website';
	export let twitterCard = 'business-card.png';
</script>

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />
<meta name="keywords" content={keywords} />
<meta name="author" content="ResAds" />

<!-- Canonical Link -->
<link rel="canonical" href={canonical} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={ogType} />
<meta property="og:url" content={canonical} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
<meta property="og:site_name" content="ResAds" />

<!-- Twitter -->
<meta property="twitter:card" content={twitterCard} />
<meta property="twitter:url" content={canonical} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={ogImage} />

<!-- Additional SEO Best Practices -->
<meta name="robots" content="index, follow" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="theme-color" content="#ef4444" />
<meta name="application-name" content="ResAds" />
