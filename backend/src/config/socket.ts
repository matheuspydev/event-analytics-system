import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from './env';
import { logger } from '../utils/logger';

export let io: Server;

export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: config.cors.origin,
      credentials: true,
    },
    path: '/socket.io',
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Subscribe to project updates
    socket.on('subscribe:project', (projectId: string) => {
      socket.join(`project:${projectId}`);
      logger.debug(`Client ${socket.id} subscribed to project:${projectId}`);
    });

    // Unsubscribe from project updates
    socket.on('unsubscribe:project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
      logger.debug(`Client ${socket.id} unsubscribed from project:${projectId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    socket.on('error', (error) => {
      logger.error(`Socket error for client ${socket.id}:`, error);
    });
  });

  logger.info('✓ WebSocket server initialized');

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

export interface EventNotification {
  type: 'event';
  projectId: string;
  eventType: string;
  timestamp: Date;
  data: any;
}

export interface MetricNotification {
  type: 'metric';
  projectId: string;
  metricType: string;
  value: number;
  timestamp: Date;
}

export type Notification = EventNotification | MetricNotification;

export function emitToProject(projectId: string, event: string, data: Notification): void {
  if (io) {
    io.to(`project:${projectId}`).emit(event, data);
  }
}
