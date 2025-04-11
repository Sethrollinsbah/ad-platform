// src/routes/api/ws/+server.ts
import { Server } from 'socket.io';
import { Client } from 'pg';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import { websocketStore } from '$lib/stores/websocket-store';

interface WebSocketClient {
  id: string;
  projectId: string;
  socket: WebSocket;
  lastPing: number;
}

// Store active connections
const clients: Map<string, WebSocketClient> = new Map();

// Handle WebSocket connections
export const GET: RequestHandler = ({ url, request }) => {
  const projectId = url.searchParams.get('projectId');
  
  if (!projectId) {
    return new Response('Project ID is required', { status: 400 });
  }

  // Connect to the WebSocket
  const { socket, response } = connectWebSocket(projectId);

  // Setup PostgreSQL notification listener
  setupPostgresListener(projectId);
  
  return response;
};

/**
 * Connect to WebSocket and set up event handlers
 */
function connectWebSocket(projectId: string) {
  const { socket, response } = new WebSocketPair();
  
  // Handle connection open
  const clientId = crypto.randomUUID();
  
  // Add to clients map
  clients.set(clientId, {
    id: clientId,
    projectId,
    socket,
    lastPing: Date.now()
  });

  // Update connected clients count in store
  const currentProjectClients = Array.from(clients.values())
    .filter(client => client.projectId === projectId).length;
  
  websocketStore.update(store => {
    return {
      ...store,
      [projectId]: {
        connectedClients: currentProjectClients
      }
    };
  });

  // Set up socket event handlers
  socket.addEventListener('message', async (event) => {
    try {
      const client = clients.get(clientId);
      if (!client) return;
      
      // Update last ping time
      client.lastPing = Date.now();
      
      // Parse message
      const data = JSON.parse(event.data);
      
      // Handle message types
      if (data.type === 'ping') {
        socket.send(JSON.stringify({ type: 'pong' }));
      } else if (data.type === 'node_update') {
        // Broadcast to other clients in the same project
        broadcastToProject(projectId, {
          event: 'node_update',
          data: data.data,
          source: clientId
        }, clientId);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  });

  // Handle disconnect
  socket.addEventListener('close', () => {
    clients.delete(clientId);
    
    // Update connected clients count in store
    const updatedProjectClients = Array.from(clients.values())
      .filter(client => client.projectId === projectId).length;
    
    websocketStore.update(store => {
      return {
        ...store,
        [projectId]: {
          connectedClients: updatedProjectClients
        }
      };
    });
    
    console.log(`Client ${clientId} disconnected`);
  });

  // Handle errors
  socket.addEventListener('error', (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error);
    clients.delete(clientId);
  });

  console.log(`Client ${clientId} connected to project ${projectId}`);
  
  return { socket, response };
}

/**
 * Set up PostgreSQL notification listener for a project
 */
async function setupPostgresListener(projectId: string) {
  const connectionString = env.DATABASE_URL || 'postgres://root:mysecretpassword@localhost:5432/local';
  
  try {
    const client = new Client({
      connectionString,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    await client.connect();
    
    // Listen for node configuration changes
    await client.query(`LISTEN node_configurations_${projectId}`);
    
    client.on('notification', (msg) => {
      try {
        if (msg.channel === `node_configurations_${projectId}`) {
          const payload = JSON.parse(msg.payload || '{}');
          
          // Broadcast to all clients in this project
          broadcastToProject(projectId, {
            event: 'node_config_change',
            data: payload
          });
        }
      } catch (error) {
        console.error('Error processing Postgres notification:', error);
      }
    });
    
    // Handle connection errors
    client.on('error', (err) => {
      console.error('Postgres notification listener error:', err);
      
      // Attempt to reconnect
      setTimeout(() => {
        client.end();
        setupPostgresListener(projectId);
      }, 5000);
    });
    
    console.log(`Postgres notification listener set up for project ${projectId}`);
  } catch (error) {
    console.error('Error setting up Postgres notification listener:', error);
  }
}

/**
 * Broadcast a message to all clients in a project
 */
function broadcastToProject(projectId: string, message: any, excludeClientId?: string) {
  // Get all clients for this project
  const projectClients = Array.from(clients.values())
    .filter(client => client.projectId === projectId && client.id !== excludeClientId);
  
  // Broadcast message
  const messageString = JSON.stringify(message);
  projectClients.forEach(client => {
    if (client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(messageString);
    }
  });
  
  console.log(`Broadcasted to ${projectClients.length} clients in project ${projectId}`);
}

/**
 * Create a WebSocket pair
 */
function WebSocketPair() {
  // In a real implementation, this would be handled by your hosting platform
  // This is a simplified version for demonstration
  const server = new WebSocket.Server({ noServer: true });
  const socket = new WebSocket('ws://localhost:5173');
  
  // Create a response that upgrades the connection
  const response = new Response(null, {
    status: 101,
    webSocket: server
  });
  
  return { socket, response };
}

// Set up a heartbeat interval to clean up stale connections
setInterval(() => {
  const now = Date.now();
  
  // Find and remove stale connections (no activity for 30 seconds)
  for (const [id, client] of clients.entries()) {
    if (now - client.lastPing > 30000) {
      console.log(`Removing stale client ${id}`);
      client.socket.close();
      clients.delete(id);
      
      // Update connected clients count in store
      const projectId = client.projectId;
      const updatedProjectClients = Array.from(clients.values())
        .filter(c => c.projectId === projectId).length;
      
      websocketStore.update(store => {
        return {
          ...store,
          [projectId]: {
            connectedClients: updatedProjectClients
          }
        };
      });
    }
  }
}, 10000);
