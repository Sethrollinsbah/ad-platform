<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { goto } from '$app/navigation';
	import { Play, Pause, Calendar, Server, Plus } from 'lucide-svelte';
	import { formatDistanceToNow } from 'date-fns';
	import type { Writable } from 'svelte/store';
	import { selectedProjectId } from '@/lib';

	// Define project types
	type Project = {
		id: string;
		name: string;
		lastUpdated: Date;
		services: {
			id: string;
			name: string;
			active: boolean;
		}[];
		active: boolean;
	};

	interface DashboardProjectComponentProps {
		projects: Writable<Project[]>;
		updateProject: (project: Project) => void;
	}
	let { projects, updateProject } = $props() as DashboardProjectComponentProps;
	// State for new project dialog
	let dialogOpen = $state(false);
	let newProjectName = $state('');
	let isCreating = $state(false);
	let errorMessage = $state('');

	// Function to toggle project active status
	function toggleProjectStatus(project: Project) {
		const updatedProject = {
			...project,
			active: !project.active
		};
		updateProject(updatedProject);
	}

	// Function to navigate to project details
	function navigateToProject(projectId: string) {
		selectedProjectId.set(projectId);
		goto(`/dashboard/${projectId}`);
	}

	// Function to get active service count
	function getActiveServiceCount(services) {
		return services?.filter((service) => service.active).length || 0;
	}

	// Function to create a new project
	async function createProject() {
		if (!newProjectName.trim()) {
			errorMessage = 'Project name is required';
			return;
		}

		try {
			isCreating = true;
			errorMessage = '';

			const response = await fetch('/api/projects', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newProjectName })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to create project');
			}

			const newProject = await response.json();

			// Update projects store
			projects.update((current) => [
				...current,
				{
					...newProject,
					lastUpdated: new Date(newProject.lastUpdated),
					services: newProject.services || []
				}
			]);

			// Reset form and close dialog
			newProjectName = '';
			dialogOpen = false;

			// Navigate to the new project
			navigateToProject(newProject.id);
		} catch (error) {
			console.error('Error creating project:', error);
			errorMessage = error.message || 'Failed to create project';
		} finally {
			isCreating = false;
		}
	}
</script>

<div class="container py-8">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold">Your Projects</h2>
			<p class="text-muted-foreground">Manage your restaurant marketing projects</p>
		</div>
		<Button on:click={() => (dialogOpen = true)}>
			<Plus class="mr-2 h-4 w-4" /> New Project
		</Button>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#if $projects.length === 0}
			<div
				class="col-span-full flex h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-8 text-center"
			>
				<div>
					<h3 class="mb-2 text-lg font-medium">No projects yet</h3>
					<p class="mb-4 text-sm text-gray-500">
						Create your first project to get started with ResAds
					</p>
					<Button on:click={() => (dialogOpen = true)}>
						<Plus class="mr-2 h-4 w-4" /> Create Project
					</Button>
				</div>
			</div>
		{:else}
			{#each $projects as project (project.id)}
				<Card class="transition-shadow hover:shadow-md">
					<CardHeader class="pb-2">
						<div class="flex items-start justify-between">
							<CardTitle class="truncate text-xl" title={project.name}>{project.name}</CardTitle>
							<Button
								variant="ghost"
								size="icon"
								on:click={(e) => {
									e.stopPropagation();
									toggleProjectStatus(project);
								}}
								class="h-8 w-8"
								aria-label={project.active ? 'Pause Project' : 'Activate Project'}
							>
								{#if project.active}
									<Tooltip>
										<TooltipTrigger>
											<Pause class="h-4 w-4 text-amber-500" />
										</TooltipTrigger>
										<TooltipContent>Pause Project</TooltipContent>
									</Tooltip>
								{:else}
									<Tooltip>
										<TooltipTrigger>
											<Play class="h-4 w-4 text-emerald-500" />
										</TooltipTrigger>
										<TooltipContent>Activate Project</TooltipContent>
									</Tooltip>
								{/if}
							</Button>
						</div>
						<div class="flex items-center space-x-1 text-sm text-muted-foreground">
							<Calendar class="mr-1 h-3 w-3" />
							<span>Updated {formatDistanceToNow(project.lastUpdated)} ago</span>
						</div>
					</CardHeader>

					<CardContent>
						<div class="mt-2 flex items-center">
							<Server class="mr-2 h-4 w-4 text-muted-foreground" />
							<span class="text-sm font-medium">{project.services?.length || 0} Services</span>
							<Badge variant="outline" class="ml-2 text-xs">
								{getActiveServiceCount(project.services)} active
							</Badge>
						</div>

						<div class="mt-4 flex max-h-16 flex-wrap gap-2 overflow-hidden">
							{#if project.services && project.services.length > 0}
								{#each project.services.slice(0, 5) as service}
									<Badge variant={service.active ? 'default' : 'outline'}>
										{service.name}
									</Badge>
								{/each}
								{#if project.services.length > 5}
									<Badge variant="secondary">+{project.services.length - 5} more</Badge>
								{/if}
							{:else}
								<p class="text-xs text-gray-500">No services configured yet</p>
							{/if}
						</div>
					</CardContent>

					<CardFooter class="pt-1">
						<div class="flex w-full justify-between gap-2">
							<Badge variant={project.active ? 'success' : 'destructive'} class="flex-shrink-0">
								{project.active ? 'Active' : 'Paused'}
							</Badge>
							<Button
								variant="outline"
								class="flex-grow"
								on:click={() => navigateToProject(project.id)}
							>
								View Details
							</Button>
						</div>
					</CardFooter>
				</Card>
			{/each}
		{/if}
	</div>
</div>

<!-- New Project Dialog -->
<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create New Project</Dialog.Title>
			<Dialog.Description>
				Create a new restaurant marketing project. You can add campaigns and platforms later.
			</Dialog.Description>
		</Dialog.Header>

		<form on:submit|preventDefault={createProject} class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="project-name" class="text-right">Name</Label>
				<Input
					id="project-name"
					placeholder="My Restaurant Project"
					class="col-span-3"
					bind:value={newProjectName}
					required
					autofocus
				/>
			</div>

			{#if errorMessage}
				<p class="text-sm text-red-500">{errorMessage}</p>
			{/if}
		</form>

		<Dialog.Footer>
			<Button variant="outline" on:click={() => (dialogOpen = false)} disabled={isCreating}>
				Cancel
			</Button>
			<Button
				type="submit"
				on:click={createProject}
				disabled={!newProjectName.trim() || isCreating}
			>
				{isCreating ? 'Creating...' : 'Create'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
