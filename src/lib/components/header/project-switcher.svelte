<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ChevronDown, Plus } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	// Import projectId from the lib
	import { projectId } from '@/lib';
	import type { GetProjectsResponse } from '@/routes/api/projects';

	// Define project types
	type Project = {
		id: string;
		name: string;
		displayName: string;
	};

	// Current project ID state using Svelte 5's $state
	let position = $state<string | undefined>($page.params.projectId || undefined);
	let dialogOpen = $state(false);
	let projectName = $state('');
	let creationType = $state('fresh'); // 'fresh' or 'duplicate'
	let isLoading = $state(true);
	let errorMessage = $state('');

	// Available projects list using Svelte 5's $state
	let availableProjects = $state<Project[]>([]);

	// Fetch projects from the API
	async function fetchProjects() {
		try {
			isLoading = true;
			errorMessage = '';

			const response = await fetch('/api/projects');
			if (!response.ok) {
				throw new Error(`Failed to fetch projects: ${response.status}`);
			}

			const projectsData = await response.json();

			// Format projects for dropdown
			availableProjects = projectsData.map((project: GetProjectsResponse) => ({
				id: project.id,
				name: project.name,
				displayName: project.displayName
			}));

			isLoading = false;
		} catch (error) {
			console.error('Error fetching projects:', error);
			errorMessage = 'Failed to load projects';
			isLoading = false;
		}
	}

	// Check if projectId matches URL param
	$effect(() => {
		const urlProjectId = $page.params.projectId || '';

		// Only update if they're different to avoid unnecessary state changes
		if ($projectId !== urlProjectId) {
			$projectId = urlProjectId;
			position = urlProjectId || undefined;
		}
	});

	// Watch for changes in the page params
	$effect(() => {
		$projectId = $page.params.projectId || '';
		position = $page.params.projectId || undefined;
	});

	// Check for campaign parameter and open dialog if needed
	function checkCampaignParam() {
		if (!browser) return;

		const url = new URL(window.location.href);
		const campaignParam = url.searchParams.get('campaign');

		if (campaignParam === 'new' && !dialogOpen) {
			dialogOpen = true;
		}
	}

	// Clean up URL when dialog closes
	$effect(() => {
		if (browser && !dialogOpen) {
			const url = new URL(window.location.href);
			if (url.searchParams.has('campaign')) {
				url.searchParams.delete('campaign');
				window.history.replaceState({}, '', url.toString());
			}
		}
	});

	// Create a function to set up URL change monitoring
	function setupUrlChangeListener() {
		if (!browser) return;

		// Original methods for cleanup
		const originalPushState = window.history.pushState;
		const originalReplaceState = window.history.replaceState;

		// Custom event handler
		const handleUrlChange = () => checkCampaignParam();

		// Override pushState
		window.history.pushState = function () {
			const result = originalPushState.apply(this, arguments);
			window.dispatchEvent(new Event('pushstate'));
			handleUrlChange();
			return result;
		};

		// Override replaceState
		window.history.replaceState = function () {
			const result = originalReplaceState.apply(this, arguments);
			window.dispatchEvent(new Event('replacestate'));
			handleUrlChange();
			return result;
		};

		// Listen for popstate (back/forward navigation)
		window.addEventListener('popstate', handleUrlChange);

		// Listen for our custom events
		window.addEventListener('pushstate', handleUrlChange);
		window.addEventListener('replacestate', handleUrlChange);
		window.addEventListener('urlchange', handleUrlChange);

		// Return cleanup function
		return () => {
			window.removeEventListener('popstate', handleUrlChange);
			window.removeEventListener('pushstate', handleUrlChange);
			window.removeEventListener('replacestate', handleUrlChange);
			window.removeEventListener('urlchange', handleUrlChange);
			window.history.pushState = originalPushState;
			window.history.replaceState = originalReplaceState;
		};
	}

	// Set up listeners on mount and initial URL check
	let cleanup = $state(() => {});

	onMount(() => {
		// Fetch projects
		fetchProjects();

		// Set up keyboard shortcut
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.key === 'n' || e.key === 'N') && e.ctrlKey) {
				e.preventDefault();
				dialogOpen = true;
			}
		};
		window.addEventListener('keydown', handleKeyDown);

		// Set up URL change monitoring
		cleanup = setupUrlChangeListener();

		// Initial check
		checkCampaignParam();

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	// Clean up URL listeners when component is destroyed
	onDestroy(() => {
		if (cleanup) cleanup();
	});

	async function handleCreateProject() {
		if (!projectName.trim()) {
			errorMessage = 'Project name is required';
			return;
		}

		try {
			errorMessage = '';

			const response = await fetch('/api/projects', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: projectName,
					// If duplicating, include source project ID
					sourceProjectId: creationType === 'duplicate' ? $projectId : undefined
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to create project');
			}

			const newProject = await response.json();

			// Update available projects
			availableProjects = [
				...availableProjects,
				{ id: newProject.id, name: newProject.name, displayName: newProject.displayName }
			];

			// Set selected project
			$projectId = newProject.name;

			// Navigate to the new project
			goto(`/dashboard/${newProject.name}`);

			// Reset and close dialog
			projectName = '';
			dialogOpen = false;
		} catch (error) {
			console.error('Error creating project:', error);
			errorMessage = error.message || 'Failed to create project';
		}
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="flex flex-row items-center gap-1">
			{#if isLoading}
				Loading...
			{:else if availableProjects.length === 0}
				No Projects
			{:else if position && availableProjects.find((p) => p.id === position)}
				{availableProjects.find((p) => p.id === position)?.name || 'Unknown Project'}
			{:else}
				Select Project
			{/if}
			<ChevronDown class="size-4 text-sm" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Label>Projects</DropdownMenu.Label>
			{#if availableProjects.length === 0}
				<DropdownMenu.Item class="opacity-50">No projects available</DropdownMenu.Item>
			{:else}
				<DropdownMenu.RadioGroup
					value={position}
					onValueChange={async (projectIdValue) => {
						console.log('Project Id: ' + projectIdValue);
						// Navigate to the selected project
						await goto(`/dashboard/${projectIdValue}`);
					}}
				>
					{#each availableProjects as project}
						<DropdownMenu.RadioItem class="capitalize" value={project.id}
							>{project.name}</DropdownMenu.RadioItem
						>
					{/each}
				</DropdownMenu.RadioGroup>
			{/if}
			<DropdownMenu.Separator />
			<DropdownMenu.Item on:click={() => (dialogOpen = true)}>
				<Plus class="mr-2 size-4" />
				<span>New Project</span>
				<DropdownMenu.Shortcut>Ctrl+N</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item on:click={() => goto('/projects')}>
				<span>Manage Projects</span>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create New Project</Dialog.Title>
			<Dialog.Description>Give your project a name to get started with ResAds.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-6 py-4">
			<div class="grid grid-cols-1 items-center gap-4">
				<Label for="projectName" class="text-start">Project Name</Label>
				<Input
					id="projectName"
					bind:value={projectName}
					placeholder="My Restaurant Project"
					class="w-full"
					autofocus
				/>
				{#if errorMessage}
					<p class="text-sm text-destructive">{errorMessage}</p>
				{/if}
			</div>

			{#if availableProjects.length > 0}
				<div class="space-y-4">
					<Label>Project Type</Label>
					<RadioGroup.Root
						value={creationType}
						onValueChange={(val) => (creationType = val)}
						class="grid gap-4"
					>
						<div class="flex items-start space-x-2">
							<RadioGroup.Item value="fresh" id="r1" />
							<div class="grid gap-1.5">
								<Label for="r1" class="font-medium">Start Fresh</Label>
								<p class="text-sm text-muted-foreground">
									Create a new project with blank templates and default settings.
								</p>
							</div>
						</div>

						<div class="flex items-start space-x-2">
							<RadioGroup.Item value="duplicate" id="r2" />
							<div class="grid gap-1.5">
								<Label for="r2" class="font-medium">Duplicate Existing</Label>
								<p class="text-sm text-muted-foreground">
									Copy settings and campaigns from an existing project.
								</p>
							</div>
						</div>
					</RadioGroup.Root>

					{#if creationType === 'duplicate'}
						<div class="mt-2">
							<Select.Root
								onSelectedChange={(v) => {
									if (v) $projectId = v;
								}}
							>
								<Select.Trigger class="w-full">
									<Select.Value placeholder="Select a project to duplicate" />
								</Select.Trigger>
								<Select.Content>
									{#each availableProjects as project}
										<Select.Item value={project.id}>
											{project.name}
											{JSON.stringify(availableProjects)}
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
					{/if}
				</div>
			{/if}
		</div>
		<Dialog.Footer class="flex justify-between">
			<Button variant="outline" on:click={() => (dialogOpen = false)}>Cancel</Button>
			<Button
				type="submit"
				on:click={handleCreateProject}
				disabled={!projectName.trim() || (creationType === 'duplicate' && !$projectId)}
			>
				Create Project
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
