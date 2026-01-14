import { Job } from 'bull';
import { MetricRepository } from '../repositories/MetricRepository';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

const metricRepo = new MetricRepository(pool);

export interface MetricAggregationJobData {
  projectId: string;
  metricType: string;
  timeWindow: '1min' | '5min' | '1h' | '1d';
  startDate: Date;
  endDate: Date;
}

export async function aggregateMetrics(job: Job<MetricAggregationJobData>): Promise<void> {
  const { projectId, metricType, timeWindow, startDate, endDate } = job.data;
  
  try {
    logger.debug(`Aggregating metrics for project ${projectId}, type ${metricType}, window ${timeWindow}`);

    // This is a placeholder for more complex aggregation logic
    // In a real scenario, you might:
    // 1. Fetch raw events
    // 2. Calculate statistics (avg, percentiles, etc.)
    // 3. Store aggregated results

    const metrics = await metricRepo.getTimeSeries(
      projectId,
      metricType,
      timeWindow,
      startDate,
      endDate
    );

    logger.debug(`Found ${metrics.length} existing metric aggregations`);
  } catch (error) {
    logger.error('Error aggregating metrics:', error);
    throw error;
  }
}

export async function cleanupOldMetrics(job: Job): Promise<void> {
  try {
    const retentionDays = 90; // Keep metrics for 90 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const deleted = await metricRepo.deleteOlderThan(cutoffDate);
    logger.info(`Cleaned up ${deleted} old metric records`);
  } catch (error) {
    logger.error('Error cleaning up old metrics:', error);
    throw error;
  }
}
