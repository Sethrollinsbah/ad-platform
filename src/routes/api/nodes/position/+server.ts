// src/routes/api/nodes/position/+server.ts
import { json } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';

/**
 * Save node position for a specific project
 */
export async function POST({ request }) {
  try {
    const body = await request.json();
    const { nodeId, position, projectId } = body;
    
    if (!nodeId || !position || !projectId) {
      return json({ 
        success: false, 
        error: 'Missing required fields: nodeId, position, or projectId' 
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
      
    // Convert position to JSON string
    const positionString = JSON.stringify(position);
    
    if (existingConfig.length > 0) {
      // Update existing configuration
      await db
        .update(schema.nodeConfigurations)
        .set({
          position: positionString,
          updatedAt: new Date()
        })
        .where(eq(schema.nodeConfigurations.id, existingConfig[0].id));
    } else {
      // Extract node type from the nodeId (e.g., 'campaign-weekend-special' => 'campaign')
      const nodeType = nodeId.split('-')[0] || 'unknown';
      
      // Create new configuration
      await db
        .insert(schema.nodeConfigurations)
        .values({
          projectId: dbProjectId,
          nodeId,
          nodeType,
          position: positionString,
          // Default empty configuration
          configuration: '{}',
          createdAt: new Date(),
          updatedAt: new Date()
        });
    }
    
    return json({ success: true });
  } catch (error) {
    console.error('Error saving node position:', error);
    return json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * Get all node positions for a specific project
 */
export async function GET({ url }) {
  try {
    const projectId = url.searchParams.get('projectId');
    
    if (!projectId) {
      return json({ 
        success: false, 
        error: 'Missing required parameter: projectId' 
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
    
    // Get all node configurations for this project
    const nodeConfigs = await db
      .select()
      .from(schema.nodeConfigurations)
      .where(eq(schema.nodeConfigurations.projectId, dbProjectId));
      
    // Format the response
    const formattedConfigs = nodeConfigs.map(config => ({
      id: config.nodeId,
      type: config.nodeType,
      position: JSON.parse(config.position),
      configuration: JSON.parse(config.configuration)
    }));
    
    return json({ 
      success: true, 
      nodes: formattedConfigs 
    });
  } catch (error) {
    console.error('Error getting node positions:', error);
    return json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
