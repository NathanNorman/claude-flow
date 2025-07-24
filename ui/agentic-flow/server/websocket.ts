/**
 * WebSocket Server Setup for Real-time Updates
 */

import { Server, Socket } from 'socket.io';
import { HiveMindIntegration } from './hive-integration.js';
import { MastraIntegration } from './mastra-integration.js';
import { TerminalHandler } from './terminal-handler.js';
import { getMCPHandler, MCPToolResult } from './mcp-handler.js';

interface SocketData {
  subscribedSwarms: Set<string>;
  subscribedAgents: Set<string>;
  subscribedTasks: Set<string>;
  authenticated: boolean;
}

// Helper function to get MCP tools list
async function getMCPToolsList() {
  const mcpHandler = getMCPHandler();
  try {
    const tools = await mcpHandler.discoverTools();
    return tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
      category: getCategoryFromToolName(tool.name)
    }));
  } catch (error) {
    console.warn('Failed to discover MCP tools, using static list');
    return getStaticToolsList();
  }
}

// Helper function to execute MCP tool
async function executeMCPTool(toolName: string, parameters: any): Promise<MCPToolResult> {
  const mcpHandler = getMCPHandler();
  return await mcpHandler.executeTool(toolName, parameters);
}

// Helper function to determine tool category
function getCategoryFromToolName(toolName: string): string {
  if (toolName.includes('swarm') || toolName.includes('agent') || toolName.includes('task')) {
    return 'coordination';
  } else if (toolName.includes('memory') || toolName.includes('cache')) {
    return 'memory';
  } else if (toolName.includes('neural') || toolName.includes('model')) {
    return 'neural';
  } else if (toolName.includes('github') || toolName.includes('repo')) {
    return 'github';
  } else if (toolName.includes('monitor') || toolName.includes('status') || toolName.includes('metrics')) {
    return 'monitoring';
  } else if (toolName.includes('workflow') || toolName.includes('orchestrate')) {
    return 'workflow';
  } else if (toolName.includes('daa')) {
    return 'daa';
  } else if (toolName.includes('sparc')) {
    return 'sparc';
  } else {
    return 'system';
  }
}

// Fallback static tools list
function getStaticToolsList() {
  return [
    {
      name: 'swarm_init',
      description: 'Initialize swarm with topology and configuration',
      parameters: {
        type: 'object',
        properties: {
          topology: { type: 'string', enum: ['hierarchical', 'mesh', 'ring', 'star'] },
          maxAgents: { type: 'number', default: 8 }
        },
        required: ['topology']
      },
      category: 'coordination'
    },
    {
      name: 'agent_spawn',
      description: 'Create specialized AI agents',
      parameters: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['coordinator', 'researcher', 'coder', 'analyst', 'architect', 'tester'] },
          name: { type: 'string' }
        },
        required: ['type']
      },
      category: 'coordination'
    },
    {
      name: 'memory_usage',
      description: 'Store/retrieve persistent memory',
      parameters: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['store', 'retrieve', 'list', 'delete'] },
          key: { type: 'string' },
          value: { type: 'string' }
        },
        required: ['action']
      },
      category: 'memory'
    },
    {
      name: 'performance_report',
      description: 'Generate performance reports',
      parameters: {
        type: 'object',
        properties: {
          format: { type: 'string', enum: ['summary', 'detailed', 'json'] }
        }
      },
      category: 'system'
    }
  ];
}

export function setupWebSocket(
  io: Server,
  hive: HiveMindIntegration,
  mastra: MastraIntegration
): { terminalHandler: TerminalHandler } {

  console.log('🔌 Setting up WebSocket server...');

  // Initialize terminal handler
  const terminalHandler = new TerminalHandler(io);
  console.log('💻 Terminal handler initialized');

  io.on('connection', (socket: Socket) => {
    console.log(`👤 Client connected: ${socket.id}`);

    // Initialize socket data
    socket.data = {
      subscribedSwarms: new Set(),
      subscribedAgents: new Set(),
      subscribedTasks: new Set(),
      authenticated: true // For now, auto-authenticate
    } as SocketData;

    // Send welcome message
    socket.emit('connected', {
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      server: 'agentic-flow-backend',
      version: '2.0.0'
    });

    // ===== SWARM SUBSCRIPTIONS =====

    socket.on('subscribe:swarm', (data: { swarmId: string }) => {
      console.log(`📡 Client ${socket.id} subscribing to swarm: ${data.swarmId}`);
      
      socket.data.subscribedSwarms.add(data.swarmId);
      socket.join(`swarm:${data.swarmId}`);
      
      socket.emit('subscribed', {
        type: 'swarm',
        id: data.swarmId,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('unsubscribe:swarm', (data: { swarmId: string }) => {
      console.log(`📡 Client ${socket.id} unsubscribing from swarm: ${data.swarmId}`);
      
      socket.data.subscribedSwarms.delete(data.swarmId);
      socket.leave(`swarm:${data.swarmId}`);
      
      socket.emit('unsubscribed', {
        type: 'swarm',
        id: data.swarmId,
        timestamp: new Date().toISOString()
      });
    });

    // ===== AGENT SUBSCRIPTIONS =====

    socket.on('subscribe:agent', (data: { agentId: string }) => {
      console.log(`🤖 Client ${socket.id} subscribing to agent: ${data.agentId}`);
      
      socket.data.subscribedAgents.add(data.agentId);
      socket.join(`agent:${data.agentId}`);
      
      socket.emit('subscribed', {
        type: 'agent',
        id: data.agentId,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('unsubscribe:agent', (data: { agentId: string }) => {
      console.log(`🤖 Client ${socket.id} unsubscribing from agent: ${data.agentId}`);
      
      socket.data.subscribedAgents.delete(data.agentId);
      socket.leave(`agent:${data.agentId}`);
      
      socket.emit('unsubscribed', {
        type: 'agent',
        id: data.agentId,
        timestamp: new Date().toISOString()
      });
    });

    // ===== TASK SUBSCRIPTIONS =====

    socket.on('subscribe:task', (data: { taskId: string }) => {
      console.log(`📋 Client ${socket.id} subscribing to task: ${data.taskId}`);
      
      socket.data.subscribedTasks.add(data.taskId);
      socket.join(`task:${data.taskId}`);
      
      socket.emit('subscribed', {
        type: 'task',
        id: data.taskId,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('unsubscribe:task', (data: { taskId: string }) => {
      console.log(`📋 Client ${socket.id} unsubscribing from task: ${data.taskId}`);
      
      socket.data.subscribedTasks.delete(data.taskId);
      socket.leave(`task:${data.taskId}`);
      
      socket.emit('unsubscribed', {
        type: 'task',
        id: data.taskId,
        timestamp: new Date().toISOString()
      });
    });

    // ===== SYSTEM QUERIES =====

    socket.on('get:system-status', async () => {
      try {
        const [hiveSwarm, mastraStatus] = await Promise.all([
          hive.getCurrentSwarm(),
          mastra.getSystemStatus()
        ]);

        socket.emit('system:status', {
          system: {
            backend: 'healthy',
            version: '2.0.0',
            uptime: process.uptime(),
            connections: io.sockets.sockets.size
          },
          integrations: {
            hive: {
              connected: hive.isConnected(),
              currentSwarm: hiveSwarm
            },
            mastra: mastraStatus
          },
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        socket.emit('error', {
          message: 'Failed to get system status',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('get:agents', async () => {
      try {
        const [hiveAgents, mastraAgents] = await Promise.all([
          hive.listAgents(),
          mastra.getAgents()
        ]);

        socket.emit('agents:list', {
          hive: hiveAgents,
          mastra: mastraAgents,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        socket.emit('error', {
          message: 'Failed to get agents',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('get:performance', async () => {
      try {
        const report = await hive.getPerformanceReport();
        
        socket.emit('performance:report', {
          report,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        socket.emit('error', {
          message: 'Failed to get performance report',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // ===== DIRECT ACTIONS =====

    socket.on('action:init-swarm', async (data: {
      topology: 'mesh' | 'hierarchical' | 'ring' | 'star';
      maxAgents?: number;
      strategy?: string;
    }) => {
      try {
        const swarmId = await hive.initializeSwarm(data);
        
        socket.emit('swarm:initialized', {
          swarmId,
          topology: data.topology,
          maxAgents: data.maxAgents || 5,
          strategy: data.strategy || 'balanced',
          timestamp: new Date().toISOString()
        });

        // Auto-subscribe to the new swarm
        socket.data.subscribedSwarms.add(swarmId);
        socket.join(`swarm:${swarmId}`);

      } catch (error: any) {
        socket.emit('error', {
          message: 'Failed to initialize swarm',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('action:spawn-agent', async (data: {
      type: 'coordinator' | 'researcher' | 'coder' | 'analyst' | 'architect' | 'tester';
      name?: string;
      capabilities?: string[];
    }) => {
      try {
        const agentId = await hive.spawnAgent(data);
        
        socket.emit('agent:spawned', {
          agentId,
          type: data.type,
          name: data.name || `${data.type}-agent`,
          capabilities: data.capabilities || [],
          timestamp: new Date().toISOString()
        });

        // Auto-subscribe to the new agent
        socket.data.subscribedAgents.add(agentId);
        socket.join(`agent:${agentId}`);

      } catch (error: any) {
        socket.emit('error', {
          message: 'Failed to spawn agent',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('action:orchestrate-task', async (data: {
      task: string;
      strategy?: string;
      priority?: string;
    }) => {
      try {
        const taskId = await hive.orchestrateTask(data.task, {
          strategy: data.strategy,
          priority: data.priority
        });
        
        socket.emit('task:orchestrated', {
          taskId,
          task: data.task,
          strategy: data.strategy || 'parallel',
          priority: data.priority || 'medium',
          timestamp: new Date().toISOString()
        });

        // Auto-subscribe to the new task
        socket.data.subscribedTasks.add(taskId);
        socket.join(`task:${taskId}`);

      } catch (error: any) {
        socket.emit('error', {
          message: 'Failed to orchestrate task',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // ===== MCP TOOL ACTIONS =====

    socket.on('mcp:tools:discover', async () => {
      try {
        // Get available MCP tools (for now using static list, could be dynamic)
        const tools = await getMCPToolsList();
        
        socket.emit('mcp:tools:list', {
          tools,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        socket.emit('error', {
          message: 'Failed to discover MCP tools',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('mcp:tool:execute', async (data: {
      executionId: string;
      toolName: string;
      parameters: any;
      options?: {
        trackMetrics?: boolean;
        cacheResult?: boolean;
      };
    }) => {
      try {
        console.log(`🔧 Executing MCP tool: ${data.toolName} (${data.executionId})`);
        
        // Send progress updates during execution
        socket.emit('mcp:tool:progress', {
          executionId: data.executionId,
          progress: { message: `Starting execution of ${data.toolName}...` }
        });

        // Execute the MCP tool via the MCP handler
        const startTime = Date.now();
        const result = await executeMCPTool(data.toolName, data.parameters);
        const executionTime = Date.now() - startTime;

        // Send progress update
        socket.emit('mcp:tool:progress', {
          executionId: data.executionId,
          progress: { message: `Tool execution completed in ${executionTime}ms` }
        });

        // Send final result
        socket.emit('mcp:tool:response', {
          executionId: data.executionId,
          success: result.success,
          result: result.data,
          error: result.error,
          executionTime,
          tokenUsage: result.metadata?.tokenUsage,
          agentId: result.metadata?.agentId,
          timestamp: new Date().toISOString()
        });

      } catch (error: any) {
        console.error(`❌ MCP tool execution error:`, error);
        
        socket.emit('mcp:tool:response', {
          executionId: data.executionId,
          success: false,
          error: error.message || 'Tool execution failed',
          executionTime: 0,
          timestamp: new Date().toISOString()
        });
      }
    });

    // ===== MASTRA ACTIONS =====

    socket.on('action:run-mastra-agent', async (data: {
      agentId: string;
      input: any;
    }) => {
      try {
        const result = await mastra.runAgent(data.agentId, data.input);
        
        socket.emit('mastra:agent:result', {
          agentId: data.agentId,
          input: data.input,
          result,
          timestamp: new Date().toISOString()
        });

      } catch (error: any) {
        socket.emit('error', {
          message: 'Failed to run Mastra agent',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('action:run-mastra-workflow', async (data: {
      workflowId: string;
      input: any;
    }) => {
      try {
        const result = await mastra.runWorkflow(data.workflowId, data.input);
        
        socket.emit('mastra:workflow:result', {
          workflowId: data.workflowId,
          input: data.input,
          result,
          timestamp: new Date().toISOString()
        });

      } catch (error: any) {
        socket.emit('error', {
          message: 'Failed to run Mastra workflow',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // ===== ERROR HANDLING =====

    socket.on('error', (error) => {
      console.error(`❌ Socket error from ${socket.id}:`, error);
    });

    // ===== DISCONNECTION =====

    socket.on('disconnect', (reason) => {
      console.log(`👤 Client disconnected: ${socket.id} (${reason})`);
      
      // Clean up subscriptions
      socket.data.subscribedSwarms?.clear();
      socket.data.subscribedAgents?.clear();
      socket.data.subscribedTasks?.clear();
    });
  });

  // ===== INTEGRATION EVENT FORWARDING =====

  // Forward HiveMind events to subscribed clients
  hive.on('swarm:initialized', (data) => {
    io.to(`swarm:${data.swarmId}`).emit('swarm:update', {
      type: 'initialized',
      data,
      timestamp: new Date().toISOString()
    });
  });

  hive.on('agent:spawned', (data) => {
    io.to(`agent:${data.agentId}`).emit('agent:update', {
      type: 'spawned',
      data,
      timestamp: new Date().toISOString()
    });
  });

  hive.on('task:orchestrated', (data) => {
    io.to(`task:${data.taskId}`).emit('task:update', {
      type: 'orchestrated',
      data,
      timestamp: new Date().toISOString()
    });
  });

  // Forward Mastra events to all clients (since they're system-wide)
  mastra.on('agent:executed', (data) => {
    io.emit('mastra:agent:executed', {
      data,
      timestamp: new Date().toISOString()
    });
  });

  mastra.on('workflow:executed', (data) => {
    io.emit('mastra:workflow:executed', {
      data,
      timestamp: new Date().toISOString()
    });
  });

  mastra.on('tool:executed', (data) => {
    io.emit('mastra:tool:executed', {
      data,
      timestamp: new Date().toISOString()
    });
  });

  // Periodic status updates
  setInterval(() => {
    io.emit('system:heartbeat', {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      connections: io.sockets.sockets.size,
      integrations: {
        hive: hive.isConnected(),
        mastra: mastra.isConnected()
      }
    });
  }, 30000); // Every 30 seconds

  console.log('✅ WebSocket server setup complete');
  
  return { terminalHandler };
}