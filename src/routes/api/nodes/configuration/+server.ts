// src/routes/api/nodes/configuration/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';

/**
 * Save node configuration for a specific project
 */
export async function POST({ request }) {
  try {
    const body = await request.json();
    const { nodeId, nodeType, position, configuration, projectId } = body;
    
    if (!nodeId || !nodeType || !position || !configuration || !projectId) {
      return json({ 
        success: false, 
        error: 'Missing required fields: nodeId, nodeType, position, configuration, or projectId' 
      }, { status: 400 });
    }
    
    // First, find the project ID in the database
    let projects = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.name, projectId))
      .limit(1);
      
    // If not found, create the project entry
    if (projects.length === 0) {
      const [newProject] = await db
        .insert(schema.projects)
        .values({
          name: projectId,
          displayName: projectId,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
        
      projects = [newProject];
    }
    
    const dbProjectId = projects[0].id;
    
    // Check if a node configuration already exists
    const existingConfig = await db
      .select()
      .from(schema.nodeConfigurations)
      .where(
        and(
          eq(schema.nodeConfigurations.projectId, dbProjectId),
          eq(schema.nodeConfigurations.nodeId, nodeId)
        )
      )
      .limit(1);
      
    // Convert position and configuration to JSON strings
    const positionString = JSON.stringify(position);
    const configurationString = JSON.stringify(configuration);
    
    if (existingConfig.length > 0) {
      // Update existing configuration
      await db
        .update(schema.nodeConfigurations)
        .set({
          position: positionString,
          configuration: configurationString,
          updatedAt: new Date()
        })
        .where(eq(schema.nodeConfigurations.id, existingConfig[0].id));
    } else {
      // Create new configuration
      await db
        .insert(schema.nodeConfigurations)
        .values({
          projectId: dbProjectId,
          nodeId,
          nodeType,
          position: positionString,
          configuration: configurationString,
          createdAt: new Date(),
          updatedAt: new Date()
        });
    }
    
    return json({ success: true });
  } catch (error) {
    console.error('Error saving node configuration:', error);
    return json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * Get a specific node configuration
 */
export async function GET({ url }) {
  try {
    const projectId = url.searchParams.get('projectId');
    const nodeId = url.searchParams.get('nodeId');
    
    if (!projectId || !nodeId) {
      return json({ 
        success: false, 
        error: 'Missing required parameters: projectId or nodeId' 
      }, { status: 400 });
    }
    
    // First, find the project ID in the database
    const projects = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.name, projectId))
      .limit(1);
      
    if (projects.length === 0) {
      return json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }
    
    const dbProjectId = projects[0].id;
    
    // Get the node configuration
    const nodeConfig = await db
      .select()
      .from(schema.nodeConfigurations)
      .where(
        and(
          eq(schema.nodeConfigurations.projectId, dbProjectId),
          eq(schema.nodeConfigurations.nodeId, nodeId)
        )
      )
      .limit(1);
      
    if (nodeConfig.length === 0) {
      return json({ 
        success: false, 
        error: 'Node configuration not found' 
      }, { status: 404 });
    }
    
    // Format the response
    const config = nodeConfig[0];
    
    return json({ 
      success: true, 
      node: {
        id: config.nodeId,
        type: config.nodeType,
        position: JSON.parse(config.position),
        configuration: JSON.parse(config.configuration)
      } 
    });
  } catch (error) {
    console.error('Error getting node configuration:', error);
    return json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
