<script lang="ts">
	import { onMount } from 'svelte';
	// Import components
	import ChatInterface from './chat/chat-interface.svelte';
	import SettingsPanel from './campaign-settings/settings-panel.svelte';
	// Import Drawer components
	import * as Drawer from '$lib/components/ui/drawer';
	// Import types
	import type { CampaignSettings } from '@/lib/types/dashboard-types';
	// Icons
	import { Rocket, RefreshCw, X } from 'lucide-svelte';

	// For safe imports
	let FunnelVisualization: any = $state();
	let isFunnelLoaded = $state(false);

	// State for responsive design
	let windowWidth = $state(0);
	let drawerOpen = $state(false);

	// Campaign settings state
	let campaignSettings = $state<CampaignSettings>({
		budget: 750,
		duration: 30,
		primaryGoal: 'website',
		secondaryGoal: 'calls'
	});

	// Reference to funnel component for methods
	let funnelComponent: any;
	let highlightedPlan = $state('');

	// Toggle drawer for mobile view
	function toggleDrawer() {
		drawerOpen = !drawerOpen;
	}

	// Reset funnel to defaults
	function resetFunnel() {
		if (funnelComponent) {
			funnelComponent.resetFunnel();
		}
	}

	// Handle updates from campaign settings
	function handleSettingsUpdate(event: CustomEvent<CampaignSettings>) {
		campaignSettings = event.detail;
	}

	// Handle updates from chat conversation
	function handleConversationUpdate(event: CustomEvent) {
		const { budget, audienceFocus, conversionFocus, onlineOrdersFocus } = event.detail;

		// Update budget if provided
		if (budget !== null) {
			campaignSettings.budget = budget;
		}

		// Only update the funnel if the component is loaded and the methods are available
		if (funnelComponent && isFunnelLoaded) {
			// Update awareness node if audience is mentioned
			if (audienceFocus) {
				funnelComponent.updateNodeMetrics('1', {
					reach: '15,700',
					impressions: Math.round(campaignSettings.budget * 60).toLocaleString()
				});

				funnelComponent.updateNodeAppearance('1', {
					description: 'Target local food enthusiasts'
				});
			}

			// Update phone calls conversion if mentioned
			if (conversionFocus === 'calls') {
				funnelComponent.updateNodeMetrics('4a', {
					calls: '127',
					callRate: '6.8%'
				});

				funnelComponent.updateNodeAppearance('4a', {
					width: 140 // Make it slightly larger to emphasize
				});
			}

			// Update online orders if mentioned
			if (onlineOrdersFocus) {
				funnelComponent.updateNodeMetrics('4c', {
					orders: '104',
					orderRate: '5.6%'
				});

				funnelComponent.updateNodeAppearance('4c', {
					width: 140 // Make it slightly larger to emphasize
				});
			}
		}
	}

	onMount(() => {
		// First set up the event listeners that don't need to be async
		const handleResize = () => {
			windowWidth = window.innerWidth;
		};

		window.addEventListener('resize', handleResize);
		handleResize(); // Initial call

		// Then do the async imports
		(async () => {
			try {
				const module = await import('./funnel/funnel-visualization.svelte');
				FunnelVisualization = module.default;
				isFunnelLoaded = true;
			} catch (error) {
				console.error('Failed to load FunnelVisualization:', error);
			}
		})();

		// Return the cleanup function directly (not wrapped in a Promise)
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="flex h-[calc(100dvh-4rem)] flex-col bg-gray-50">
	<header class="border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<div class="flex items-center gap-3">
				<!-- <Logo></Logo> -->
				<h1 class="text-xl font-bold">Campaign Builder</h1>
			</div>

			<div class="flex items-center gap-4">
				<div
					class="hidden items-center rounded-lg border border-gray-200 px-3 py-1.5 text-sm sm:flex"
				>
					<span class="font-semibold text-gray-700">Budget:</span>
					<span class="ml-1">${campaignSettings.budget}</span>
				</div>
				<div
					class="hidden items-center rounded-lg border border-gray-200 px-3 py-1.5 text-sm sm:flex"
				>
					<span class="font-semibold text-gray-700">Duration</span>
					<span class="ml-1">{campaignSettings.duration} days</span>
				</div>
				<button
					class="flex items-center gap-1 rounded-lg border border-blue-500 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
				>
					<Rocket class="h-4 w-4" />
					<span class="hidden md:inline">Launch Campaign</span>
					<span class="md:hidden">Launch</span>
				</button>
			</div>
		</div>
	</header>

	<div class="flex flex-1 overflow-hidden">
		<!-- DESKTOP VIEW: Funnel Visualization Section (visible on md and up) -->
		<div class="hidden w-1/2 flex-col border-r border-gray-200 bg-gray-50 md:flex">
			<div class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
				<h2 class="text-lg font-semibold">Campaign Funnel Visualization</h2>
				<button
					onclick={resetFunnel}
					class="flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
				>
					<RefreshCw class="h-3 w-3" />
					<span>Reset</span>
				</button>
			</div>

			<div class="relative flex-1">
				{#if isFunnelLoaded && FunnelVisualization}
					<FunnelVisualization budget={campaignSettings.budget} {highlightedPlan}
					></FunnelVisualization>
				{:else}
					<div class="flex h-full w-full items-center justify-center">
						<div class="text-center">
							<div
								class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"
							></div>
							<p class="text-gray-600">Loading visualization...</p>
						</div>
					</div>
				{/if}
			</div>

			<SettingsPanel settings={campaignSettings} on:update={handleSettingsUpdate} />
		</div>

		<!-- Chat Interface Section - Fixed height with proper scrolling -->
		<div class="flex w-full flex-col md:w-1/2">
			<ChatInterface on:conversationUpdate={handleConversationUpdate}>
				<svelte:fragment slot="header-actions">
					<!-- MOBILE: Funnel Toggle Button (visible on small screens) -->
					<button
						onclick={toggleDrawer}
						class="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-sm font-medium text-gray-700 md:hidden"
					>
						<span>View Funnel</span>
					</button>
				</svelte:fragment>
			</ChatInterface>
		</div>
	</div>

	<!-- MOBILE: Drawer for Funnel Visualization -->
	<Drawer.Root bind:open={drawerOpen} snapPoints={['90%']} closeOnOutsideClick={true}>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 z-50 bg-black/40" />
			<Drawer.Content
				class="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-[90%] flex-col rounded-t-lg border-t border-gray-200 bg-white"
				style="contain: content;"
			>
				<div class="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
					<h2 class="text-lg font-semibold">Campaign Funnel</h2>
					<Drawer.Close class="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
						<X class="h-5 w-5" />
					</Drawer.Close>
				</div>

				<div class="relative flex-1 overflow-hidden">
					{#if drawerOpen && isFunnelLoaded && FunnelVisualization}
						<!-- Only render when drawer is actually open -->
						<div style="contain: layout size;">
							<FunnelVisualization
								budget={campaignSettings.budget}
								{highlightedPlan}
								simplified={true}
								<!--
								Add
								this
								prop
								to
								your
								component
								--
							>
								></FunnelVisualization
							>
						</div>
					{:else}
						<div class="flex h-full w-full items-center justify-center">
							<div class="text-center">
								<div
									class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"
								></div>
								<p class="text-gray-600">Loading visualization...</p>
							</div>
						</div>
					{/if}
				</div>

				<SettingsPanel settings={campaignSettings} on:update={handleSettingsUpdate}>
					<div class="mt-4 flex justify-end">
						<button
							onclick={resetFunnel}
							class="mr-2 flex items-center gap-1 rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
						>
							<RefreshCw class="h-3 w-3" />
							<span>Reset Funnel</span>
						</button>

						<Drawer.Close
							class="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
						>
							<span>Back to Chat</span>
						</Drawer.Close>
					</div>
				</SettingsPanel>
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
</div>
