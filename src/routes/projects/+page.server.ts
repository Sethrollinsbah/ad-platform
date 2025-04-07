// src/routes/projects/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  // Fetch projects from the API
  const response = await fetch('/api/projects');
  const projects = await response.json();
  
  return {
    projects
  };
};
