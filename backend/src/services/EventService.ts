import { EventRepository, EventFilters } from '../repositories/EventRepository';
import { CreateEventDTO } from '../types';
import { EventModel } from '../models/Event';

export class EventService {
  constructor(private eventRepo: EventRepository) {}

  async createEvent(data: CreateEventDTO): Promise<EventModel> {
    return this.eventRepo.create(data);
  }

  async createEventBatch(events: CreateEventDTO[]): Promise<EventModel[]> {
    return this.eventRepo.createBatch(events);
  }

  async getEvents(filters: EventFilters): Promise<{ events: EventModel[]; total: number }> {
    const [events, total] = await Promise.all([
      this.eventRepo.find(filters),
      this.eventRepo.count(filters),
    ]);

    return { events, total };
  }
}
