<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import FunnelNode from './funnel-node.svelte';
	import { defaultFunnelSteps, updateMetricsForBudget } from './funnel-data';
	import type { FunnelStep, FunnelEdge } from '../dashboard-types';
	import Dnd from '../dnd.svelte';

	const dispatch = createEventDispatcher();

	// Define props interface
	interface FunnelVisualizationProps {
		budget?: number;
		funnelSteps?: FunnelStep[];
		highlightedPlan?: string;
	}

	// Props with Svelte 5 syntax
	let {
		budget = 750,
		funnelSteps = defaultFunnelSteps,
		highlightedPlan = ''
	} = $props() as FunnelVisualizationProps;

	// Reactive state
	let edges = $state<FunnelEdge[]>([]);
	let canvas: any; // Svelvet canvas reference
	let isMounted = $state(false);
	let Svelvet: any= $state();
	let Node: any= $state();
	let Edge: any= $state();

	// When funnelSteps change, update edges - using $effect instead of reactive block
	$effect(() => {
		edges = [];
		funnelSteps.forEach((step) => {
			step.targets.forEach((targetId) => {
				edges.push({
					id: `${step.id}-${targetId}`,
					source: step.id,
					target: targetId,
					animated: true,
					label: '',
					color: step.color
				});
			});
		});
	});

	// Update metrics when budget changes - using $effect instead of reactive block
	$effect(() => {
		if (budget) {
			funnelSteps = updateMetricsForBudget(funnelSteps, budget);
		}
	});

	// Reset funnel to defaults
	function resetFunnel() {
		funnelSteps = defaultFunnelSteps;
		dispatch('reset');
	}

	// Update a specific node's metrics
	function updateNodeMetrics(nodeId: string, metrics: Record<string, string>) {
		funnelSteps = funnelSteps.map((step) => {
			if (step.id === nodeId) {
				return {
					...step,
					metrics: { ...step.metrics, ...metrics }
				};
			}
			return step;
		});
	}

	// Update a node's appearance (width, etc.)
	function updateNodeAppearance(nodeId: string, updates: Partial<FunnelStep>) {
		funnelSteps = funnelSteps.map((step) => {
			if (step.id === nodeId) {
				return { ...step, ...updates };
			}
			return step;
		});
	}

	// Safely import Svelvet only on the client side
	onMount(async () => {
		try {
			// Dynamically import Svelvet components
			const svelvetModule = await import('svelvet');
			Svelvet = svelvetModule.Svelvet;
			Node = svelvetModule.Node;
			Edge = svelvetModule.Edge;
			isMounted = true;
		} catch (error) {
			console.error('Failed to load Svelvet:', error);
		}
	});
</script>

<div class="relative flex-1">
	{#if isMounted && Svelvet && Node && Edge}
		<Dnd></Dnd>
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
