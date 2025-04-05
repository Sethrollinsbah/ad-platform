<script lang="ts">
	import { X } from 'lucide-svelte';

	// Notification type for styling
	type NotificationType = 'success' | 'info' | 'warning' | 'error';

	// Props for notification item
	interface NotificationItemProps {
		id: number;
		title: string;
		message: string;
		time: string;
		type?: NotificationType;
		read?: boolean;
		icon: any;
		onRead?: (id: number) => void;
		onDismiss?: (id: number) => void;
	}

	let {
		id,
		title,
		message,
		time,
		type = 'info',
		read = false,
		icon: Icon,
		onRead = () => {},
		onDismiss = () => {}
	} = $props() as NotificationItemProps;

	// Notification type styling
	function getTypeStyles(notificationType: NotificationType) {
		switch (notificationType) {
			case 'success':
				return {
					bg: 'bg-green-50',
					border: 'border-green-200',
					icon: 'text-green-500',
					iconBg: 'bg-green-100'
				};
			case 'warning':
				return {
					bg: 'bg-amber-50',
					border: 'border-amber-200',
					icon: 'text-amber-500',
					iconBg: 'bg-amber-100'
				};
			case 'error':
				return {
					bg: 'bg-red-50',
					border: 'border-red-200',
					icon: 'text-red-500',
					iconBg: 'bg-red-100'
				};
			case 'info':
			default:
				return {
					bg: 'bg-blue-50',
					border: 'border-blue-200',
					icon: 'text-blue-500',
					iconBg: 'bg-blue-100'
				};
		}
	}

	// Compute styles based on type
	let styles = $derived(getTypeStyles(type));
</script>

<div
	class="group relative p-4 transition-colors hover:bg-gray-50 {!read ? styles.bg : ''}"
	on:mouseenter={() => !read && onRead(id)}
>
	<div class="flex gap-3">
		<div
			class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full {styles.iconBg}"
		>
			<Icon class="h-5 w-5 {styles.icon}" />
		</div>
		<div class="flex-1 overflow-hidden">
			<div class="flex items-start justify-between gap-2">
				<p class="truncate text-sm font-medium">{title}</p>
				<button
					class="opacity-0 transition-opacity group-hover:opacity-100"
					on:click={() => onDismiss(id)}
				>
					<X class="h-4 w-4 text-gray-400 hover:text-gray-600" />
				</button>
			</div>
			<p class="mt-1 line-clamp-2 text-xs text-gray-600">{message}</p>
			<p class="mt-1 text-xs text-gray-400">{time}</p>
		</div>
	</div>
</div>
