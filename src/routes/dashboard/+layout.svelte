<script lang="ts">
	import '../../app.css';

	import { Menu, Bell } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import Logo from '$lib/components/logo.svelte';
	import { cn } from '$lib/utils';
	import Notifications from '@/lib/components/header/notifications.svelte';
	import ProjectSwitcher from '@/lib/components/header/project-switcher.svelte';
	import { selectedProjectId } from '@/lib';
	import AccountMenu from '@/lib/components/header/account-menu.svelte';

	// Window width state
	let windowWidth = $state(0);

	// Extract props for the slot
	let { data, children } = $props();
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="flex h-screen w-full bg-gray-50">
	<!-- Main content container -->
	<div class="flex flex-1 flex-col transition-all duration-300 ease-in-out">
		<!-- Header -->
		<header
			class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6"
		>
			<div class="flex items-center">
				<a href="/projects" class="flex items-center gap-3">
					<Logo scale="scale-50" />
					<span class="text-sm font-light">ResAds</span>
				</a>
				<span class="mx-2 text-sm font-light">/</span>
				<ProjectSwitcher></ProjectSwitcher>
			</div>

			<div class="flex items-center space-x-3">
				<Notifications></Notifications>
				<div class="relative flex items-center space-x-2">
					<AccountMenu></AccountMenu>
				</div>
			</div>
		</header>

		<!-- Page content -->
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>
