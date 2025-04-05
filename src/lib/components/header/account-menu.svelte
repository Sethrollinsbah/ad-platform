<script lang="ts">
	import {
		LayoutGrid,
		Menu,
		BarChart3,
		PlusCircle,
		FileText,
		Settings,
		HelpCircle,
		LogOut,
		Bell,
		User
	} from 'lucide-svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as DropdownMenu from '@/lib/components/ui/dropdown-menu';
	import Button from '../ui/button/button.svelte';
	import { selectedProjectId } from '@/lib';

	let navigationItems = $state([
		{ icon: LayoutGrid, label: 'Dashboard', href: `/dashboard/${$selectedProjectId}` },
		{ icon: BarChart3, label: 'Analytics', href: `/dashboard/${$selectedProjectId}/analytics` },
		{
			icon: PlusCircle,
			label: 'New Campaign',
			href: `?campaign=new`
		},
		{ icon: FileText, label: 'Campaigns', href: `/dashboard/${$selectedProjectId}/campaigns` },
		{ icon: Settings, label: 'Settings', href: `/dashboard/${$selectedProjectId}/settings` }
	]);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" class="flex items-center space-x-2">
			<Avatar.Root>
				<Avatar.Fallback>
					<User class="h-5 w-5 text-gray-500" />
				</Avatar.Fallback>
			</Avatar.Root>
			<span class="hidden text-sm font-medium md:inline">Restaurant Owner</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Label>My Account</DropdownMenu.Label>
		<DropdownMenu.Separator />

		{#each navigationItems as ni}
			<DropdownMenu.Item href={ni.href}>
				<svelte:component this={ni.icon} class="mr-2 h-4 w-4"></svelte:component>
				<span>{ni.label}</span>
			</DropdownMenu.Item>
		{/each}
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="" href={'/help-center'}>
			<HelpCircle class="mr-2 h-4 w-4" />
			<span>Help & Support</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item class="text-red-600" href={'/api/logout'}>
			<LogOut class="mr-2 h-4 w-4" />
			<span>Logout</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
