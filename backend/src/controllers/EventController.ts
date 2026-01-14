import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/EventService';
import { CreateEventDTO } from '../types';

export class EventController {
  constructor(private eventService: EventService) {}

  createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateEventDTO = {
        ...req.body,
        metadata: {
          ...req.body.metadata,
          userAgent: req.headers['user-agent'],
          ip: req.ip,
        },
      };
      
      const event = await this.eventService.createEvent(data);
      
      res.status(201).json({
        status: 'success',
        data: event.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  createEventBatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { events } = req.body;
      
      const eventsWithMetadata = events.map((event: CreateEventDTO) => ({
        ...event,
        metadata: {
          ...event.metadata,
          userAgent: req.headers['user-agent'],
          ip: req.ip,
        },
      }));
      
      const createdEvents = await this.eventService.createEventBatch(eventsWithMetadata);
      
      res.status(201).json({
        status: 'success',
        data: {
          count: createdEvents.length,
          events: createdEvents.map((e) => e.toJSON()),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = {
        projectId: req.query.projectId as string,
        eventType: req.query.eventType as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        limit: parseInt(req.query.limit as string) || 100,
        offset: parseInt(req.query.offset as string) || 0,
      };
      
      const { events, total } = await this.eventService.getEvents(filters);
      
      res.json({
        status: 'success',
        data: {
          events: events.map((e) => e.toJSON()),
          pagination: {
            total,
            limit: filters.limit,
            offset: filters.offset,
            hasMore: filters.offset + events.length < total,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
