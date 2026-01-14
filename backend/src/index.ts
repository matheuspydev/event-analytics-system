import { createApp } from './app';
import { config, validateConfig } from './config/env';
import { testConnection, closeConnection } from './config/database';
import { initRedis, closeRedis } from './config/redis';
import { closeQueues } from './config/queue';
import { initializeSocket } from './config/socket';
import { startWorkers } from './workers';
import { logger } from './utils/logger';
import { Server } from 'http';

let server: Server;

async function startServer(): Promise<void> {
  try {
    // Validate configuration
    validateConfig();
    logger.info('Configuration validated');

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    // Initialize Redis
    await initRedis();

    // Start queue workers
    startWorkers();

    // Create Express app
    const app = createApp();

    // Start server
    server = app.listen(config.port, config.host, () => {
      logger.info(`🚀 Server running on http://${config.host}:${config.port}`);
      logger.info(`📊 Environment: ${config.env}`);
    });

    // Initialize WebSocket
    initializeSocket(server);

    // Graceful shutdown
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(): Promise<void> {
  logger.info('Graceful shutdown initiated...');

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await closeQueues();
        await closeRedis();
        await closeConnection();
        logger.info('All connections closed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

// Start the server
startServer();
