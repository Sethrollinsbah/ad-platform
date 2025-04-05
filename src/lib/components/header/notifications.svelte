<script lang="ts">
	import { Bell, X, TrendingUp, Calendar, AlertCircle, Info, ShoppingBag } from 'lucide-svelte';
	import * as DropdownMenu from '../ui/dropdown-menu';
	import Button from '../ui/button/button.svelte';
	import NotificationItem from './notification-item.svelte';
	import { onMount } from 'svelte';

	// Notification type definition
	interface Notification {
		id: number;
		title: string;
		message: string;
		time: string;
		type: 'success' | 'info' | 'warning' | 'error';
		read: boolean;
		icon: typeof TrendingUp;
	}

	// Initial notifications
	let notifications: Notification[] = [
		{
			id: 1,
			title: 'Weekend Campaign Performance',
			message:
				'Your weekend special campaign is performing 15% above average. Consider increasing budget allocation.',
			time: '10 minutes ago',
			type: 'success',
			read: false,
			icon: TrendingUp
		},
		{
			id: 2,
			title: 'Scheduled Campaign Starting Soon',
			message: "Your 'Happy Hour Promotion' campaign will go live tomorrow at 10:00 AM.",
			time: '25 minutes ago',
			type: 'info',
			read: false,
			icon: Calendar
		},
		{
			id: 3,
			title: 'Budget Alert',
			message:
				'Your Facebook Ads platform has reached 80% of its allocated budget. Review performance metrics.',
			time: '1 hour ago',
			type: 'warning',
			read: false,
			icon: AlertCircle
		}
	];

	// State variables
	let unreadCount = $state(notifications.filter((n) => !n.read).length);
	let activeNotifications = $state(notifications);

	// Mark notification as read
	function markAsRead(id: number) {
		activeNotifications = activeNotifications.map((notification) => {
			if (notification.id === id && !notification.read) {
				unreadCount--;
				return { ...notification, read: true };
			}
			return notification;
		});
	}

	// Dismiss notification
	function dismissNotification(id: number) {
		const notification = activeNotifications.find((n) => n.id === id);
		if (notification && !notification.read) {
			unreadCount--;
		}
		activeNotifications = activeNotifications.filter((notification) => notification.id !== id);
	}

	// Mark all notifications as read
	function markAllAsRead() {
		activeNotifications = activeNotifications.map((notification) => ({
			...notification,
			read: true
		}));
		unreadCount = 0;
	}

	// Periodically add new notifications (for demo)
	onMount(() => {
		const interval = setInterval(() => {
			if (Math.random() > 0.7 && activeNotifications.length < 8) {
				const newId = Math.max(...activeNotifications.map((n) => n.id)) + 1;
				const newNotification: Notification = {
					id: newId,
					title: 'New Menu Item Performance',
					message: 'Your new Seasonal Burger is generating 23% more revenue than other menu items.',
					time: 'Just now',
					type: 'success',
					read: false,
					icon: ShoppingBag
				};

				activeNotifications = [newNotification, ...activeNotifications];
				unreadCount++;
			}
		}, 30000); // Every 30 seconds

		return () => clearInterval(interval);
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="icon" class="relative">
			<Bell class="h-5 w-5" />
			{#if unreadCount > 0}
				<span
					class="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
				>
					{unreadCount}
				</span>
			{/if}
		</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="w-80 p-0">
		<div class="flex items-center justify-between border-b p-3">
			<DropdownMenu.Label>Notifications</DropdownMenu.Label>
			{#if unreadCount > 0}
				<DropdownMenu.Item class="text-xs" on:click={markAllAsRead}>
					Mark all as read
				</DropdownMenu.Item>
			{/if}
		</div>

		<div class="max-h-[calc(80vh-8rem)] overflow-y-auto">
			{#if activeNotifications.length === 0}
				<div class="flex flex-col items-center justify-center p-6 text-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
						<Bell class="h-6 w-6 text-gray-400" />
					</div>
					<h3 class="mt-3 text-sm font-medium">No notifications</h3>
					<p class="mt-1 text-xs text-gray-500">You're all caught up!</p>
				</div>
			{:else}
				{#each activeNotifications as notification (notification.id)}
					<DropdownMenu.Item
						class="p-0 hover:bg-transparent focus:bg-transparent"
						preventDefaultEvents={true}
					>
						<NotificationItem
							id={notification.id}
							title={notification.title}
							message={notification.message}
							time={notification.time}
							type={notification.type}
							icon={notification.icon}
							read={notification.read}
							onRead={markAsRead}
							onDismiss={dismissNotification}
						/>
					</DropdownMenu.Item>
				{/each}
			{/if}
		</div>

		<div class="border-t p-3 text-center">
			<DropdownMenu.Item
				class="text-xs font-medium text-blue-500 hover:text-blue-700"
				href="/dash/settings/notifications"
			>
				View all notifications
			</DropdownMenu.Item>
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>
