import { eventQueue, metricQueue } from '../config/queue';
import { CreateEventDTO } from '../types';
import { logger } from '../utils/logger';

export class QueueService {
  async enqueueEvent(event: CreateEventDTO): Promise<void> {
    try {
      await eventQueue.add('process-event', { event }, {
        priority: 1,
        attempts: 3,
      });
      logger.debug(`Event enqueued for processing`);
    } catch (error) {
      logger.error('Error enqueuing event:', error);
      throw error;
    }
  }

  async enqueueBatchEvents(events: CreateEventDTO[]): Promise<void> {
    try {
      await eventQueue.add('process-batch-events', { events }, {
        priority: 2,
        attempts: 3,
      });
      logger.debug(`Batch of ${events.length} events enqueued for processing`);
    } catch (error) {
      logger.error('Error enqueuing batch events:', error);
      throw error;
    }
  }

  async enqueueMetricAggregation(
    projectId: string,
    metricType: string,
    timeWindow: '1min' | '5min' | '1h' | '1d',
    startDate: Date,
    endDate: Date
  ): Promise<void> {
    try {
      await metricQueue.add('aggregate-metrics', {
        projectId,
        metricType,
        timeWindow,
        startDate,
        endDate,
      }, {
        priority: 5,
        attempts: 2,
      });
      logger.debug(`Metric aggregation enqueued`);
    } catch (error) {
      logger.error('Error enqueuing metric aggregation:', error);
      throw error;
    }
  }

  async getQueueStats(): Promise<any> {
    const [eventQueueCounts, metricQueueCounts] = await Promise.all([
      eventQueue.getJobCounts(),
      metricQueue.getJobCounts(),
    ]);

    return {
      eventQueue: eventQueueCounts,
      metricQueue: metricQueueCounts,
    };
  }
}
