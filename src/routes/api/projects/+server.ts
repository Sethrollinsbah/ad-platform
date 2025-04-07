// src/routes/api/projects/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';

export async function GET() {
  try {
    // Fetch all projects from the database
    const projects = await db.query.projects.findMany({
      orderBy: [schema.projects.updatedAt],
      // Include services info in future versions when schema supports it
    });
    
    // Transform dates and add default services if needed
    const formattedProjects = projects.map(project => ({
      id: project.id.toString(),
      name: project.displayName || project.name,
      lastUpdated: project.updatedAt,
      // In a full implementation, we'd fetch services from a related table
      // For now, we'll provide a placeholder array
      services: [],
      active: project.active || false
    }));
    
    return json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    if (!data.name) {
      return json({ error: 'Project name is required' }, { status: 400 });
    }
    
    // Create a new project
    const [newProject] = await db
      .insert(schema.projects)
      .values({
        name: data.name.toLowerCase().replace(/\s+/g, '-'), // URL-friendly name
        displayName: data.name,
        active: data.active ?? true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return json({
      id: newProject.id.toString(),
      name: newProject.displayName || newProject.name,
      lastUpdated: newProject.updatedAt,
      services: [],
      active: newProject.active || false
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return json({ error: 'Failed to create project' }, { status: 500 });
  }
}
