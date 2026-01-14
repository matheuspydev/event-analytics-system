import { Job } from 'bull';
import { EventRepository } from '../repositories/EventRepository';
import { MetricRepository } from '../repositories/MetricRepository';
import { NotificationService } from '../services/NotificationService';
import { pool } from '../config/database';
import { logger } from '../utils/logger';
import { CreateEventDTO } from '../types';

const eventRepo = new EventRepository(pool);
const metricRepo = new MetricRepository(pool);
const notificationService = new NotificationService();

export interface EventJobData {
  event: CreateEventDTO;
}

export interface BatchEventJobData {
  events: CreateEventDTO[];
}

export async function processEvent(job: Job<EventJobData>): Promise<void> {
  const { event } = job.data;
  
  try {
    // Save event to database
    const savedEvent = await eventRepo.create(event);
    logger.debug(`Event ${savedEvent.id} saved`);

    // Notify real-time listeners
    notificationService.notifyNewEvent(savedEvent.toJSON());

    // Trigger metric aggregation
    await aggregateMetrics(event);
  } catch (error) {
    logger.error('Error processing event:', error);
    throw error;
  }
}

export async function processBatchEvents(job: Job<BatchEventJobData>): Promise<void> {
  const { events } = job.data;
  
  try {
    // Save events in batch
    const savedEvents = await eventRepo.createBatch(events);
    logger.debug(`Batch of ${savedEvents.length} events saved`);

    // Notify real-time listeners
    if (events.length > 0) {
      notificationService.notifyBatchEvents(events[0].projectId, savedEvents.length);
    }

    // Trigger metric aggregation for each event
    await Promise.all(events.map(event => aggregateMetrics(event)));
  } catch (error) {
    logger.error('Error processing batch events:', error);
    throw error;
  }
}

async function aggregateMetrics(event: CreateEventDTO): Promise<void> {
  const now = new Date();
  
  // Round timestamp to different time windows
  const timeWindows = {
    '1min': roundToMinute(now, 1),
    '5min': roundToMinute(now, 5),
    '1h': roundToHour(now),
    '1d': roundToDay(now),
  };

  // Create/update metric aggregations for each time window
  const promises = Object.entries(timeWindows).map(async ([window, timestamp]) => {
    const metric = await metricRepo.upsert({
      projectId: event.projectId,
      metricType: event.eventType,
      timeWindow: window as '1min' | '5min' | '1h' | '1d',
      timestamp,
      count: 1,
      data: {},
    });

    // Notify metric update for 1min window only (to avoid spam)
    if (window === '1min') {
      notificationService.notifyMetricUpdate(metric.toJSON());
    }
  });

  await Promise.all(promises);
}

function roundToMinute(date: Date, minutes: number): Date {
  const ms = 1000 * 60 * minutes;
  return new Date(Math.floor(date.getTime() / ms) * ms);
}

function roundToHour(date: Date): Date {
  const ms = 1000 * 60 * 60;
  return new Date(Math.floor(date.getTime() / ms) * ms);
}

function roundToDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
