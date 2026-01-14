import { eventQueue, metricQueue } from '../config/queue';
import { processEvent, processBatchEvents } from '../jobs/eventProcessor';
import { aggregateMetrics, cleanupOldMetrics } from '../jobs/metricAggregator';
import { logger } from '../utils/logger';

export function startWorkers(): void {
  // Event processing workers
  eventQueue.process('process-event', 10, processEvent);
  eventQueue.process('process-batch-events', 5, processBatchEvents);
  
  logger.info('✓ Event processing workers started');

  // Metric aggregation workers
  metricQueue.process('aggregate-metrics', 5, aggregateMetrics);
  
  logger.info('✓ Metric aggregation workers started');

  // Schedule cleanup job (runs daily)
  metricQueue.add('cleanup-old-metrics', {}, {
    repeat: {
      cron: '0 2 * * *', // 2 AM daily
    },
  });

  metricQueue.process('cleanup-old-metrics', cleanupOldMetrics);
  
  logger.info('✓ Cleanup worker scheduled');
}
