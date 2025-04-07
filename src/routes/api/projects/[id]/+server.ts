// src/routes/api/projects/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export async function PUT({ params, request }) {
  try {
    const projectId = parseInt(params.id);
    
    if (isNaN(projectId)) {
      return json({ error: 'Invalid project ID' }, { status: 400 });
    }
    
    const data = await request.json();
    
    // Update project data
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    };
    
    // Only update fields that are provided
    if (data.name !== undefined) {
      updateData.displayName = data.name;
    }
    
    if (data.active !== undefined) {
      updateData.active = data.active;
    }
    
    // Update the project
    const [updatedProject] = await db
      .update(schema.projects)
      .set(updateData)
      .where(eq(schema.projects.id, projectId))
      .returning();
    
    if (!updatedProject) {
      return json({ error: 'Project not found' }, { status: 404 });
    }
    
    return json({
      id: updatedProject.id.toString(),
      name: updatedProject.displayName || updatedProject.name,
      lastUpdated: updatedProject.updatedAt,
      services: [], // Placeholder for future implementation
      active: updatedProject.active || false
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE({ params }) {
  try {
    const projectId = parseInt(params.id);
    
    if (isNaN(projectId)) {
      return json({ error: 'Invalid project ID' }, { status: 400 });
    }
    
    // Delete the project
    const result = await db
      .delete(schema.projects)
      .where(eq(schema.projects.id, projectId))
      .returning();
    
    if (result.length === 0) {
      return json({ error: 'Project not found' }, { status: 404 });
    }
    
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
