<script lang="ts">
	import { Bell } from 'lucide-svelte';

	// Props for notification icon
	interface NotificationIconProps {
		unreadCount?: number;
	}

	let { unreadCount = 0 } = $props() as NotificationIconProps;
</script>

<div class="relative">
	<Bell class="h-5 w-5" />
	{#if unreadCount > 0}
		<span
			class="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
		>
			{unreadCount}
		</span>
	{/if}
</div>
