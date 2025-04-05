<script>
	import { onMount } from 'svelte';
	import { X, Check, Bell, ArrowLeft, Filter, Search } from 'lucide-svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge';

	// Tab state
	let currentTab = $state('all');

	// Example notifications data
	let notifications = $state([
		{
			id: 1,
			title: 'Weekend Campaign Performance',
			message:
				'Your weekend special campaign is performing 15% above average. Consider increasing budget allocation.',
			time: '10 minutes ago',
			category: 'campaign',
			read: false
		},
		{
			id: 2,
			title: 'Scheduled Campaign Starting Soon',
			message: "Your 'Happy Hour Promotion' campaign will go live tomorrow at 10:00 AM.",
			time: '25 minutes ago',
			category: 'campaign',
			read: false
		},
		{
			id: 3,
			title: 'Budget Alert',
			message:
				'Your Facebook Ads platform has reached 80% of its allocated budget. Review performance metrics.',
			time: '1 hour ago',
			category: 'budget',
			read: false
		},
		{
			id: 4,
			title: 'New Customer Data Available',
			message: '112 new customer records have been added to your database from recent orders.',
			time: '3 hours ago',
			category: 'data',
			read: true
		},
		{
			id: 5,
			title: 'Email Campaign Delivered',
			message: "Your 'Tuesday Taco Special' email was successfully delivered to 2,458 subscribers.",
			time: '5 hours ago',
			category: 'campaign',
			read: true
		},
		{
			id: 6,
			title: 'Analytics Report Ready',
			message: 'Your monthly restaurant performance report is now available to view.',
			time: '1 day ago',
			category: 'analytics',
			read: true
		},
		{
			id: 7,
			title: 'Menu Item Performance',
			message: 'Your new Seasonal Burger is generating 23% more revenue than other menu items.',
			time: '2 days ago',
			category: 'analytics',
			read: true
		}
	]);

	let searchQuery = $state('');
	let filteredNotifications = $derived(
		notifications
			.filter((notification) => {
				// Filter by search query
				if (searchQuery) {
					const query = searchQuery.toLowerCase();
					return (
						notification.title.toLowerCase().includes(query) ||
						notification.message.toLowerCase().includes(query)
					);
				}
				return true;
			})
			.filter((notification) => {
				// Filter by tab
				if (currentTab === 'all') return true;
				if (currentTab === 'unread') return !notification.read;
				return notification.category === currentTab;
			})
	);

	// Mark notification as read
	function markAsRead(id) {
		notifications = notifications.map((notification) => {
			if (notification.id === id) {
				return { ...notification, read: true };
			}
			return notification;
		});
	}

	// Dismiss notification
	function dismissNotification(id) {
		notifications = notifications.filter((notification) => notification.id !== id);
	}

	// Mark all as read
	function markAllAsRead() {
		notifications = notifications.map((notification) => ({
			...notification,
			read: true
		}));
	}

	// Categories for filter tabs
	const categories = [
		{ id: 'all', label: 'All' },
		{ id: 'unread', label: 'Unread' },
		{ id: 'campaign', label: 'Campaigns' },
		{ id: 'budget', label: 'Budget' },
		{ id: 'analytics', label: 'Analytics' },
		{ id: 'data', label: 'Data' }
	];

	// Get unread count for each category
	function getUnreadCount(category) {
		if (category === 'all') {
			return notifications.filter((n) => !n.read).length;
		}
		if (category === 'unread') {
			return notifications.filter((n) => !n.read).length;
		}
		return notifications.filter((n) => n.category === category && !n.read).length;
	}
</script>

<div class="container mx-auto max-w-3xl px-4 py-8">
	<!-- Header -->
	<div class="mb-6 flex items-center gap-4">
		<a href="/dashboard/settings" class="rounded-full p-2 hover:bg-gray-100">
			<ArrowLeft class="h-5 w-5" />
		</a>
		<h1 class="text-2xl font-medium">Notifications</h1>
		{#if getUnreadCount('all') > 0}
			<Badge variant="outline" class="ml-2">{getUnreadCount('all')} unread</Badge>
		{/if}
		<div class="ml-auto">
			{#if getUnreadCount('all') > 0}
				<Button variant="outline" size="sm" on:click={markAllAsRead}>
					<Check class="mr-2 h-4 w-4" /> Mark all as read
				</Button>
			{/if}
		</div>
	</div>

	<!-- Search and filters -->
	<div class="mb-6 flex flex-col gap-4 sm:flex-row">
		<div class="relative flex-1">
			<Search class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
			<Input
				bind:value={searchQuery}
				placeholder="Search notifications..."
				class="pl-9 focus-visible:ring-0"
			/>
		</div>
	</div>

	<!-- Tabs -->
	<Tabs.Root value={currentTab} onValueChange={(val) => (currentTab = val)} class="mb-4">
		<Tabs.List class="border-b-0 p-0">
			{#each categories as category}
				<Tabs.Trigger
					value={category.id}
					class="rounded-full border px-3 py-1.5 data-[state=active]:bg-gray-900 data-[state=active]:text-white"
				>
					{category.label}
					{#if getUnreadCount(category.id) > 0 && category.id !== 'unread'}
						<span
							class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
							>{getUnreadCount(category.id)}</span
						>
					{/if}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
	</Tabs.Root>

	<!-- Notifications List -->
	<div class="rounded-lg border">
		{#if filteredNotifications.length === 0}
			<div class="flex flex-col items-center justify-center px-6 py-16">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
					<Bell class="h-8 w-8 text-gray-400" />
				</div>
				<h3 class="mt-4 text-lg font-medium">No notifications</h3>
				<p class="mt-1 text-gray-500">
					{searchQuery
						? "We couldn't find any notifications matching your search"
						: "You're all caught up!"}
				</p>
			</div>
		{:else}
			<div class="divide-y">
				{#each filteredNotifications as notification (notification.id)}
					<div
						class="group flex items-start gap-4 p-4 transition-colors hover:bg-gray-50"
						class:bg-gray-50={!notification.read}
						on:click={() => markAsRead(notification.id)}
					>
						<div class="w-full">
							<div class="flex items-start justify-between gap-4">
								<h3 class="text-sm font-medium">{notification.title}</h3>
								<div class="flex gap-2">
									{#if !notification.read}
										<div class="h-2 w-2 rounded-full bg-blue-500"></div>
									{/if}
									<button
										class="opacity-0 transition-opacity group-hover:opacity-100"
										on:click|stopPropagation={() => dismissNotification(notification.id)}
									>
										<X class="h-4 w-4 text-gray-400 hover:text-gray-600" />
									</button>
								</div>
							</div>
							<p class="mt-1 text-sm text-gray-600">{notification.message}</p>
							<div class="mt-2 flex items-center gap-2">
								<Badge variant="outline" class="px-2 py-0 text-xs capitalize">
									{notification.category}
								</Badge>
								<span class="text-xs text-gray-400">{notification.time}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
