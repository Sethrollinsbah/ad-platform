// src/routes/dashboard/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ params, fetch }) => {
  // Check if a project ID is provided
  const projectId = params.projectId;
  
  if (!projectId) {
    // Fetch the first active project from the database
    const projects = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.active, true))
      .orderBy(schema.projects.createdAt)
      .limit(1);
    
    if (projects.length > 0) {
      // Redirect to the first active project
      throw redirect(302, `/dashboard/${projects[0].name}`);
    } else {
      // If no active projects exist, redirect to projects page
      throw redirect(302, '/projects');
    }
  }
  
  // If we have a project ID, fetch project data for the layout
  const projects = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.name, projectId));
  console.log("Projects found: "+projects)
  
  // If the project doesn't exist, redirect to projects page
  if (projects.length === 0) {
    throw redirect(302, '/projects');
  }
  
  const project = projects[0];
  
  // Fetch restaurant data for this project
  const restaurants = await db
    .select()
    .from(schema.restaurants)
    .where(eq(schema.restaurants.projectId, project.id));
  
  const restaurant = restaurants.length > 0 ? restaurants[0] : null;
  
  return {
    project: {
      id: project.id.toString(),
      name: project.displayName || project.name,
      active: project.active
    },
    restaurant: restaurant ? {
      id: restaurant.id.toString(),
      name: restaurant.name,
      type: restaurant.type,
      location: restaurant.location
    } : null
  };
};
