<script lang="ts">
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import DashboardProjectComponents from './dashboard-project-components.svelte';
	import { selectedProjectId } from '@/lib';

	export let data: PageData;

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

	// Initialize projects store with data from the server
	let projects = writable<Project[]>(
		data.projects.map((project) => ({
			...project,
			lastUpdated: new Date(project.lastUpdated),
			// Ensure services property exists and is correctly typed
			services: project.services || []
		}))
	);

	// Function to update a project (to be passed to the ProjectGrid component)
	async function updateProject(updatedProject: Project) {
		try {
			// Update the project on the server
			const response = await fetch(`/api/projects/${updatedProject.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedProject)
			});

			if (!response.ok) {
				throw new Error(`Failed to update project: ${response.status}`);
			}

			// Update the local store
			projects.update((items) =>
				items.map((project) => (project.id === updatedProject.id ? updatedProject : project))
			);

			// If we're toggling a project to inactive and it's currently selected,
			// clear the selected project
			if (!updatedProject.active && $selectedProjectId === updatedProject.id) {
				selectedProjectId.set('');
			}
		} catch (error) {
			console.error('Error updating project:', error);
			// Revert the update in case of an error
			const response = await fetch('/api/projects');
			const refreshedProjects = await response.json();
			projects.set(
				refreshedProjects.map((project) => ({
					...project,
					lastUpdated: new Date(project.lastUpdated),
					services: project.services || []
				}))
			);
		}
	}
</script>

<div class="flex min-h-screen flex-col">
	<main class="flex-1 bg-background">
		<!-- Dashboard Header -->
		<div class="border-b">
			<div class="container flex h-16 items-center justify-between">
				<h1 class="text-xl font-semibold">Projects Dashboard</h1>
			</div>
		</div>

		<!-- Project Grid -->
		<DashboardProjectComponents {projects} {updateProject} />
	</main>
</div>
