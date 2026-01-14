import { Event, CreateEventDTO } from '../types';

export class EventModel implements Event {
  id: string;
  projectId: string;
  eventType: string;
  data: Record<string, any>;
  metadata: {
    userAgent?: string;
    ip?: string;
    timestamp: Date;
  };
  createdAt: Date;

  constructor(data: Event) {
    this.id = data.id;
    this.projectId = data.projectId;
    this.eventType = data.eventType;
    this.data = data.data;
    this.metadata = data.metadata;
    this.createdAt = data.createdAt;
  }

  static fromDatabase(row: any): EventModel {
    return new EventModel({
      id: row.id,
      projectId: row.project_id,
      eventType: row.event_type,
      data: row.data,
      metadata: row.metadata,
      createdAt: new Date(row.created_at),
    });
  }

  toJSON(): Event {
    return {
      id: this.id,
      projectId: this.projectId,
      eventType: this.eventType,
      data: this.data,
      metadata: this.metadata,
      createdAt: this.createdAt,
    };
  }
}
