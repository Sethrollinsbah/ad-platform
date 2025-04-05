<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, Calendar, Clock } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	// Import helper functions and types
	import { getGuideById, getRelatedGuides, formatGuideContent } from '../../help-center-helpers';
	import type { Guide } from '../../types';

	// Guide ID from URL parameter
	const guideId = $page.params.guideid;

	// State for guide data
	let guide = $state<Guide | undefined>(undefined);
	let relatedGuides = $state<Guide[]>([]);
	let formattedContent = $state('');
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	// Feedback state
	let feedbackSubmitted = $state(false);
	let helpfulFeedback = $state<boolean | null>(null);

	// Get icon component by name
	function getIconComponent(iconName: string) {
		// This is a simplified approach - in a real app, you'd import and map all icons
		const icons = {
			Book: null,
			FileText: null,
			Activity: null,
			Calendar: null,
			MapPin: null,
			DollarSign: null,
			Share2: null,
			Smartphone: null
		};

		// Since we don't have all icons imported, just return null
		return icons[iconName as keyof typeof icons];
	}

	// Submit feedback
	function submitFeedback(helpful: boolean) {
		helpfulFeedback = helpful;
		feedbackSubmitted = true;

		// In a real app, you would send this feedback to your server
		console.log(`Feedback submitted for guide ${guideId}: ${helpful ? 'Helpful' : 'Not helpful'}`);
	}

	// Load guide data
	onMount(() => {
		try {
			// Get the guide by ID
			const foundGuide = getGuideById(guideId);

			if (!foundGuide) {
				error = 'Guide not found';
				isLoading = false;
				return;
			}

			guide = foundGuide;

			// Format the guide content
			formattedContent = formatGuideContent(guide);

			// Get related guides
			relatedGuides = getRelatedGuides(guideId);

			isLoading = false;
		} catch (err) {
			error = 'Error loading guide content';
			isLoading = false;
			console.error(err);
		}
	});
</script>

<div class="container mx-auto py-10">
	{#if isLoading}
		<div class="flex h-64 items-center justify-center">
			<div class="text-center">
				<div
					class="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"
				></div>
				<p>Loading guide content...</p>
			</div>
		</div>
	{:else if error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
			<h2 class="mb-2 text-xl font-semibold text-red-700">Error</h2>
			<p class="text-red-600">{error}</p>
			<div class="mt-4">
				<a href="/help-center" class="text-red-600 hover:underline">Return to Help Center</a>
			</div>
		</div>
	{:else if guide}
		<!-- Guide Header -->
		<div class="mb-8">
			<div class="mb-4">
				<a
					href="/help-center"
					class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
				>
					<ArrowLeft class="mr-1 h-4 w-4" />
					Back to Help Center
				</a>
			</div>

			<div class="flex items-center gap-2">
				{#if getIconComponent(guide.icon)}
					<svelte:component this={getIconComponent(guide.icon)} class="h-6 w-6 text-red-500" />
				{/if}
				<Badge variant="outline">{guide.category}</Badge>
			</div>

			<h1 class="mb-3 mt-3 text-3xl font-bold">{guide.title}</h1>
			<p class="mb-6 text-gray-600">{guide.description}</p>

			<div class="flex flex-wrap items-center gap-6 text-sm text-gray-500">
				{#if guide.readTime}
					<div class="flex items-center gap-1">
						<Clock class="h-4 w-4" />
						<span>{guide.readTime}</span>
					</div>
				{/if}

				{#if guide.lastUpdated}
					<div class="flex items-center gap-1">
						<Calendar class="h-4 w-4" />
						<span>Updated: {guide.lastUpdated}</span>
					</div>
				{/if}

				{#if guide.author}
					<div>By: {guide.author}</div>
				{/if}
			</div>
		</div>

		<!-- Guide Content -->
		<Card.Root class="mb-10 p-8">
			<div class="prose max-w-none">
				{#each guide.sections as section}
					<h2 class="mb-4 text-2xl font-bold">{section.heading}</h2>
					<div class="mb-8 whitespace-pre-line">
						{@html section.content.replace(/\n\n/g, '<br><br>')}
					</div>
				{/each}
			</div>
		</Card.Root>

		<!-- Related Guides -->
		{#if relatedGuides.length > 0}
			<div class="mb-10">
				<h3 class="mb-6 text-xl font-semibold">Related Guides</h3>
				<div class="grid gap-6 md:grid-cols-3">
					{#each relatedGuides as relatedGuide}
						<Card.Root class="overflow-hidden transition-all hover:shadow-md">
							<Card.Header class="p-5">
								<div class="mb-2 flex items-center justify-between">
									<Badge variant="outline">{relatedGuide.category}</Badge>
								</div>
								<Card.Title class="text-lg">{relatedGuide.title}</Card.Title>
								<Card.Description>{relatedGuide.description}</Card.Description>
							</Card.Header>
							<Card.Footer class="flex items-center justify-between border-t bg-gray-50 p-4">
								<span class="text-xs text-gray-500">{relatedGuide.readTime}</span>
								<a
									href={`/help-center/guides/${relatedGuide.id}`}
									class="inline-flex items-center text-sm font-medium text-red-500 hover:underline"
								>
									Read guide
								</a>
							</Card.Footer>
						</Card.Root>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Guide Footer -->
		<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
			<div>
				{#if !feedbackSubmitted}
					<p class="text-sm text-gray-500">Was this guide helpful?</p>
					<div class="mt-2 flex gap-2">
						<Button variant="outline" size="sm" on:click={() => submitFeedback(true)}>Yes</Button>
						<Button variant="outline" size="sm" on:click={() => submitFeedback(false)}>No</Button>
					</div>
				{:else}
					<p class="text-sm text-green-600">Thank you for your feedback!</p>
				{/if}
			</div>

			<div>
				<a href="/help-center" class="text-sm text-red-500 hover:underline"> Browse more guides </a>
			</div>
		</div>
	{:else}
		<div class="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
			<h2 class="mb-2 text-xl font-semibold text-amber-700">Guide Not Found</h2>
			<p class="text-amber-600">Sorry, we couldn't find the guide you were looking for.</p>
			<div class="mt-4">
				<a href="/help-center" class="text-amber-600 hover:underline">Return to Help Center</a>
			</div>
		</div>
	{/if}
</div>
