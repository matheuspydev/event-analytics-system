import { emitToProject, EventNotification, MetricNotification } from '../config/socket';
import { logger } from '../utils/logger';
import { Event, MetricAggregation } from '../types';

export class NotificationService {
  notifyNewEvent(event: Event): void {
    try {
      const notification: EventNotification = {
        type: 'event',
        projectId: event.projectId,
        eventType: event.eventType,
        timestamp: event.createdAt,
        data: event.data,
      };

      emitToProject(event.projectId, 'new:event', notification);
      logger.debug(`Event notification sent for project ${event.projectId}`);
    } catch (error) {
      logger.error('Error sending event notification:', error);
    }
  }

  notifyMetricUpdate(metric: MetricAggregation): void {
    try {
      const notification: MetricNotification = {
        type: 'metric',
        projectId: metric.projectId,
        metricType: metric.metricType,
        value: metric.count,
        timestamp: metric.timestamp,
      };

      emitToProject(metric.projectId, 'update:metric', notification);
      logger.debug(`Metric notification sent for project ${metric.projectId}`);
    } catch (error) {
      logger.error('Error sending metric notification:', error);
    }
  }

  notifyBatchEvents(projectId: string, count: number): void {
    try {
      emitToProject(projectId, 'batch:events', {
        type: 'event',
        projectId,
        count,
        timestamp: new Date(),
      });
      logger.debug(`Batch event notification sent for project ${projectId}`);
    } catch (error) {
      logger.error('Error sending batch notification:', error);
    }
  }
}
