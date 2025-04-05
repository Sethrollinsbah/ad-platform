<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { MessageSquare, Send } from 'lucide-svelte';
	import {
		generateAIResponse,
		extractBudgetFromInput,
		determineConversationFocus
	} from './chat-utils';
	import type { ChatMessage, RestaurantInfo } from '../dashboard-types';

	const dispatch = createEventDispatcher();

	// Define the props interface
	interface ChatInterfaceProps {
		initialMessages?: ChatMessage[];
	}

	// Use the interface with $props()
	let {
		initialMessages = [
			{
				sender: 'ai',
				content:
					"Hi there! I'm your ResAds campaign assistant. I'll help you create an effective restaurant ad campaign. What kind of restaurant are you promoting?",
				timestamp: new Date()
			}
		]
	} = $props() as ChatInterfaceProps;

	// State using Svelte 5 reactive primitives
	let messages = $state(initialMessages);
	let newMessage = $state('');
	let loading = $state(false);
	let chatContainer: HTMLElement;

	// Restaurant info state (updated during conversation)
	let restaurantInfo = $state({
		name: '',
		type: '',
		location: '',
		targetAudience: '',
		goals: ''
	});

	// Predefined suggestion buttons
	const chatSuggestions = [
		{
			text: 'Audience targeting',
			message: "What's the best audience targeting for my restaurant?"
		},
		{
			text: 'Budget allocation',
			message: 'How should I split my budget?'
		},
		{
			text: 'Creative assets',
			message: 'What creative assets do I need?'
		},
		{
			text: 'Platform recommendations',
			message: 'Which platforms are best for restaurants?'
		}
	];

	// Function to handle sending a message
	function sendMessage() {
		if (!newMessage.trim()) return;

		// Add user message
		messages = [
			...messages,
			{
				sender: 'user',
				content: newMessage.trim(),
				timestamp: new Date()
			}
		];

		// Clear input and set loading state
		const userQuestion = newMessage;
		newMessage = '';
		loading = true;

		// Simulate AI response (would be replaced with actual API call in production)
		setTimeout(() => {
			const aiResponse = generateAIResponse(userQuestion, restaurantInfo);
			messages = [
				...messages,
				{
					sender: 'ai',
					content: aiResponse,
					timestamp: new Date()
				}
			];
			loading = false;

			// Extract conversation insights and dispatch to parent
			const budget = extractBudgetFromInput(userQuestion);
			const focusAreas = determineConversationFocus(userQuestion);

			// Dispatch event to update funnel
			dispatch('conversationUpdate', {
				budget,
				...focusAreas,
				input: userQuestion
			});
		}, 1000);
	}

	// Function to use a suggested message
	function useSuggestion(suggestedMessage: string) {
		newMessage = suggestedMessage;
		sendMessage();
	}

	// Using Svelte 5 $effect for reactive scroll behavior
	$effect(() => {
		if (messages.length && chatContainer) {
			setTimeout(() => {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}, 50);
		}
	});

	onMount(() => {
		// Initial scroll to bottom
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});
</script>

<div class="flex h-full flex-col bg-white">
	<div class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
		<h2 class="text-lg font-semibold">AI Campaign Assistant</h2>
		<slot name="header-actions"></slot>
	</div>

	<div class="flex-1 overflow-y-auto p-4" bind:this={chatContainer}>
		{#each messages as message}
			<div class="mb-4 flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
				<div
					class="{message.sender === 'user'
						? 'bg-red-500 text-white'
						: 'bg-gray-100 text-gray-800'} max-w-3/4 rounded-lg px-4 py-2 shadow-sm"
				>
					{#if message.sender === 'ai'}
						<div class="mb-1 flex items-center">
							<div
								class="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white"
							>
								<MessageSquare class="h-3 w-3" />
							</div>
							<span class="ml-2 font-semibold">ResAds Assistant</span>
						</div>
					{/if}
					<div class="whitespace-pre-line">{message.content}</div>
					<div
						class="mt-1 text-right text-xs {message.sender === 'user'
							? 'text-red-200'
							: 'text-gray-500'}"
					>
						{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</div>
				</div>
			</div>
		{/each}

		{#if loading}
			<div class="mb-4 flex justify-start">
				<div class="max-w-3/4 flex items-center rounded-lg bg-gray-100 px-4 py-3 text-gray-700">
					<div class="typing-indicator">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="border-t border-gray-200 p-4">
		<form on:submit|preventDefault={sendMessage} class="flex gap-2">
			<input
				type="text"
				bind:value={newMessage}
				placeholder="Ask about restaurant ad strategies, targeting, budgets..."
				class="flex-1 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200"
			/>
			<button
				type="submit"
				class="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 disabled:opacity-50"
				disabled={loading || !newMessage.trim()}
			>
				<Send class="h-5 w-5" />
			</button>
		</form>

		<div class="mt-3 flex flex-wrap gap-2">
			{#each chatSuggestions as suggestion}
				<button
					on:click={() => useSuggestion(suggestion.message)}
					class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
				>
					{suggestion.text}
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.typing-indicator {
		display: flex;
		align-items: center;
	}

	.typing-indicator span {
		height: 8px;
		width: 8px;
		margin: 0 2px;
		background-color: #888;
		border-radius: 50%;
		display: inline-block;
		animation: typing 1.4s infinite ease-in-out both;
	}

	.typing-indicator span:nth-child(1) {
		animation-delay: 0s;
	}

	.typing-indicator span:nth-child(2) {
		animation-delay: 0.2s;
	}

	.typing-indicator span:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes typing {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
