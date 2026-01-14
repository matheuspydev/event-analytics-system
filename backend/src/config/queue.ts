import Bull, { Queue, QueueOptions } from 'bull';
import { config } from './env';
import { logger } from '../utils/logger';

const queueOptions: QueueOptions = {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password || undefined,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
};

// Event processing queue
export const eventQueue: Queue = new Bull('event-processing', queueOptions);

// Metric aggregation queue
export const metricQueue: Queue = new Bull('metric-aggregation', queueOptions);

// Setup queue event listeners
function setupQueueListeners(queue: Queue, name: string): void {
  queue.on('error', (error) => {
    logger.error(`Queue ${name} error:`, error);
  });

  queue.on('failed', (job, err) => {
    logger.error(`Job ${job.id} in queue ${name} failed:`, err);
  });

  queue.on('stalled', (job) => {
    logger.warn(`Job ${job.id} in queue ${name} stalled`);
  });

  queue.on('completed', (job) => {
    logger.debug(`Job ${job.id} in queue ${name} completed`);
  });
}

setupQueueListeners(eventQueue, 'event-processing');
setupQueueListeners(metricQueue, 'metric-aggregation');

export async function closeQueues(): Promise<void> {
  await Promise.all([
    eventQueue.close(),
    metricQueue.close(),
  ]);
  logger.info('All queues closed');
}
