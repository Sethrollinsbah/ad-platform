<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { goto } from '$app/navigation';
	import { Play, Pause, Calendar, Server, Plus } from 'lucide-svelte';
	import { formatDistanceToNow } from 'date-fns';
	import type { Writable } from 'svelte/store';

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

	// Props
	export let projects: Writable<Project[]>;
	export let updateProject: (project: Project) => void;

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
		goto(`/dashboard/${projectId}`);
	}

	// Function to get active service count
	function getActiveServiceCount(services) {
		return services.filter((service) => service.active).length;
	}
</script>

<div class="container py-8">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold">Your Projects</h2>
			<p class="text-muted-foreground">{$projects.length} projects total</p>
		</div>
		<Button on:click={() => goto('/project/new')}>
			<Plus class="mr-2 h-4 w-4" /> New Project
		</Button>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
						<span class="text-sm font-medium">{project.services.length} Services</span>
						<Badge variant="outline" class="ml-2 text-xs">
							{getActiveServiceCount(project.services)} active
						</Badge>
					</div>

					<div class="mt-4 flex max-h-16 flex-wrap gap-2 overflow-hidden">
						{#each project.services.slice(0, 5) as service}
							<Badge variant={service.active ? 'default' : 'outline'}>
								{service.name}
							</Badge>
						{/each}
						{#if project.services.length > 5}
							<Badge variant="secondary">+{project.services.length - 5} more</Badge>
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
	</div>
</div>
