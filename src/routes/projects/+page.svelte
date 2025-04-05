<script lang="ts">
import {projects} from '@/lib'
	import { writable, get } from 'svelte/store';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import DashboardProjectComponents from './dashboard-project-components.svelte';

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

	// Initialize projects store with SSR-friendly approach

	// Simulate fetching projects from API
	// Function to update a project (to be passed to the ProjectGrid component)
	function updateProject(updatedProject: Project) {
		projects.update((items) =>
			items.map((project) => (project.id === updatedProject.id ? updatedProject : project))
		);

		// In a real app, you would also make an API call to update the project on the server
		// For example:
		// await fetch(`/api/projects/${updatedProject.id}`, {
		//   method: 'PUT',
		//   headers: { 'Content-Type': 'application/json' },
		//   body: JSON.stringify(updatedProject)
		// });
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
