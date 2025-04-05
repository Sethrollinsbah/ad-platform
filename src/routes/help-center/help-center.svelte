<script lang="ts">
	import { Search, HelpCircle, Mail, MessageCircle } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import { onMount } from 'svelte';

	// Import helper functions and types
	import {
		getAllGuides,
		getAllFAQs,
		getAllCategories,
		getAllFAQCategories,
		getFAQsByCategory,
		searchGuides,
		searchFAQs
	} from './help-center-helpers';
	import type { Guide, FAQ, Category, FAQCategory } from './types';

	// Help center state
	let searchQuery = $state('');
	let activeTab = $state('guides');
	let activeFaqCategory = $state('all');

	// Data state
	let guides = $state<Guide[]>([]);
	let faqs = $state<FAQ[]>([]);
	let categories = $state<Category[]>([]);
	let faqCategories = $state<FAQCategory[]>([]);

	// Load data on mount
	onMount(() => {
		guides = getAllGuides();
		faqs = getAllFAQs();
		categories = getAllCategories();
		faqCategories = getAllFAQCategories();
	});

	// Contact options
	const contactOptions = [
		{
			title: 'Email Support',
			description: 'Get help within 24 hours',
			icon: Mail,
			action: 'Send an Email',
			link: 'mailto:support@resads.com'
		},
		{
			title: 'Live Chat',
			description: 'Chat with our support team',
			icon: MessageCircle,
			action: 'Start Chat',
			link: '#chat'
		}
	];

	// Filtered guides based on search query
	const filteredGuides = $derived(searchQuery ? searchGuides(searchQuery) : guides);

	// Filtered FAQs based on search query and category
	const filteredFaqs = $derived(() => {
		let result = searchQuery ? searchFAQs(searchQuery) : faqs;

		if (activeFaqCategory !== 'all') {
			result = result.filter((faq) => faq.category === activeFaqCategory);
		}

		return result;
	});

	// Get icon component by name
	function getIconComponent(iconName: string) {
		// This is a simplified approach - in a real app, you'd import and map all icons
		const icons = {
			Book: HelpCircle,
			FileText: HelpCircle,
			Activity: HelpCircle,
			Calendar: HelpCircle,
			MapPin: HelpCircle,
			DollarSign: HelpCircle,
			Share2: HelpCircle,
			Smartphone: HelpCircle
		};

		return icons[iconName as keyof typeof icons] || HelpCircle;
	}

	// Handle search submission
	function handleSearch() {
		// You could add analytics tracking or other logic here
		console.log(`Searching for: ${searchQuery}`);
	}
</script>

<div class="container mx-auto py-10">
	<!-- Help Center Header -->
	<div class="mb-10 text-center">
		<div class="mb-2 inline-flex items-center justify-center rounded-full bg-red-100 p-2">
			<HelpCircle class="h-6 w-6 text-red-500" />
		</div>
		<h1 class="mb-3 text-3xl font-bold">Help Center</h1>
		<p class="mx-auto mb-6 max-w-2xl text-gray-600">
			Find guides, tutorials, and answers to common questions about ResAds
		</p>

		<!-- Search Bar -->
		<form
			on:submit|preventDefault={handleSearch}
			class="mx-auto flex max-w-lg items-center rounded-lg border bg-white p-2 shadow-sm"
		>
			<Search class="ml-2 mr-3 h-5 w-5 text-gray-400" />
			<Input
				type="text"
				placeholder="Search for help..."
				bind:value={searchQuery}
				class="flex-1 border-none focus:ring-0"
			/>
			<Button type="submit" variant="default" class="ml-2">Search</Button>
		</form>
	</div>

	<!-- Tab Navigation -->
	<Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)}>
		<Tabs.List class="mx-auto w-full max-w-2xl justify-center">
			<Tabs.Trigger value="guides">Guides & Tutorials</Tabs.Trigger>
			<Tabs.Trigger value="faqs">Frequently Asked Questions</Tabs.Trigger>
			<Tabs.Trigger value="contact">Contact Support</Tabs.Trigger>
		</Tabs.List>

		<!-- Guides & Tutorials Tab -->
		<Tabs.Content value="guides" class="py-6">
			{#if filteredGuides.length === 0}
				<div class="text-center">
					<p class="text-gray-500">No guides found matching "{searchQuery}"</p>
				</div>
			{:else}
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each filteredGuides as guide}
						<Card.Root class="overflow-hidden transition-all hover:shadow-md">
							<Card.Header class="p-5">
								<div class="mb-2 flex items-center justify-between">
									<div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
										<svelte:component
											this={getIconComponent(guide.icon)}
											class="h-5 w-5 text-red-500"
										/>
									</div>
									<Badge variant="outline">{guide.category}</Badge>
								</div>
								<Card.Title class="text-lg">{guide.title}</Card.Title>
								<Card.Description>{guide.description}</Card.Description>
							</Card.Header>
							<Card.Footer class="flex items-center justify-between border-t bg-gray-50 p-4">
								<span class="text-xs text-gray-500">Last updated: {guide.lastUpdated}</span>
								<a
									href={`/help-center/guides/${guide.id}`}
									class="inline-flex items-center text-sm font-medium text-red-500 hover:underline"
								>
									Read guide
								</a>
							</Card.Footer>
						</Card.Root>
					{/each}
				</div>
			{/if}
		</Tabs.Content>

		<!-- FAQs Tab -->
		<Tabs.Content value="faqs" class="py-6">
			<!-- FAQ Category Tabs -->
			<div class="mb-6 flex justify-center space-x-2 overflow-x-auto">
				<Button
					variant={activeFaqCategory === 'all' ? 'default' : 'outline'}
					size="sm"
					on:click={() => (activeFaqCategory = 'all')}
				>
					All
				</Button>
				{#each faqCategories as category}
					<Button
						variant={activeFaqCategory === category.id ? 'default' : 'outline'}
						size="sm"
						on:click={() => (activeFaqCategory = category.id)}
					>
						<svelte:component this={getIconComponent(category.icon)} class="mr-1.5 h-3.5 w-3.5" />
						{category.name}
					</Button>
				{/each}
			</div>

			{#if filteredFaqs.length === 0}
				<div class="text-center">
					<p class="text-gray-500">No FAQs found matching "{searchQuery}"</p>
				</div>
			{:else}
				<div class="mx-auto max-w-3xl divide-y">
					{#each filteredFaqs as faq, index}
						<div class="py-6">
							<h3 class="mb-3 text-lg font-medium">{faq.question}</h3>
							<p class="text-gray-600">{faq.answer}</p>
						</div>
					{/each}
				</div>
			{/if}
		</Tabs.Content>

		<!-- Contact Support Tab -->
		<Tabs.Content value="contact" class="py-6">
			<div class="mx-auto max-w-3xl">
				<div class="mb-8 text-center">
					<h3 class="mb-2 text-xl font-semibold">Need more help?</h3>
					<p class="text-gray-600">
						Our support team is available to help you with any questions or issues
					</p>
				</div>

				<div class="grid gap-6 md:grid-cols-2">
					{#each contactOptions as option}
						<Card.Root class="overflow-hidden transition-all hover:shadow-md">
							<Card.Content class="p-6">
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
								>
									<svelte:component this={option.icon} class="h-6 w-6 text-red-500" />
								</div>
								<Card.Title class="mb-2">{option.title}</Card.Title>
								<Card.Description class="mb-6">{option.description}</Card.Description>
								<a
									href={option.link}
									class="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
								>
									{option.action}
								</a>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>

				<div class="mt-10 rounded-lg border bg-gray-50 p-6">
					<h4 class="mb-2 text-lg font-medium">Business Hours</h4>
					<p class="mb-4 text-gray-600">
						Our support team is available Monday through Friday, 9AM to 6PM ET.
					</p>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<h5 class="font-medium">Monday - Friday</h5>
							<p class="text-gray-600">9:00 AM - 6:00 PM ET</p>
						</div>
						<div>
							<h5 class="font-medium">Saturday - Sunday</h5>
							<p class="text-gray-600">Email support only</p>
						</div>
					</div>
				</div>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
