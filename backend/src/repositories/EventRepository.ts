import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { EventModel } from '../models/Event';
import { CreateEventDTO } from '../types';

export interface EventFilters {
  projectId?: string;
  eventType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export class EventRepository {
  constructor(private pool: Pool) {}

  async create(data: CreateEventDTO): Promise<EventModel> {
    const id = uuidv4();
    const metadata = {
      ...data.metadata,
      timestamp: new Date(),
    };

    const query = `
      INSERT INTO events (id, project_id, event_type, data, metadata)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [id, data.projectId, data.eventType, JSON.stringify(data.data), JSON.stringify(metadata)];
    const result = await this.pool.query(query, values);
    return EventModel.fromDatabase(result.rows[0]);
  }

  async createBatch(events: CreateEventDTO[]): Promise<EventModel[]> {
    if (events.length === 0) return [];

    const values: any[] = [];
    const placeholders: string[] = [];
    
    events.forEach((event, index) => {
      const id = uuidv4();
      const metadata = {
        ...event.metadata,
        timestamp: new Date(),
      };
      
      const offset = index * 5;
      placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`);
      values.push(id, event.projectId, event.eventType, JSON.stringify(event.data), JSON.stringify(metadata));
    });

    const query = `
      INSERT INTO events (id, project_id, event_type, data, metadata)
      VALUES ${placeholders.join(', ')}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return result.rows.map((row) => EventModel.fromDatabase(row));
  }

  async find(filters: EventFilters): Promise<EventModel[]> {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (filters.projectId) {
      conditions.push(`project_id = $${paramCount++}`);
      values.push(filters.projectId);
    }

    if (filters.eventType) {
      conditions.push(`event_type = $${paramCount++}`);
      values.push(filters.eventType);
    }

    if (filters.startDate) {
      conditions.push(`created_at >= $${paramCount++}`);
      values.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push(`created_at <= $${paramCount++}`);
      values.push(filters.endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = filters.limit || 100;
    const offset = filters.offset || 0;

    values.push(limit, offset);

    const query = `
      SELECT * FROM events
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount++} OFFSET $${paramCount++}
    `;

    const result = await this.pool.query(query, values);
    return result.rows.map((row) => EventModel.fromDatabase(row));
  }

  async count(filters: Omit<EventFilters, 'limit' | 'offset'>): Promise<number> {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (filters.projectId) {
      conditions.push(`project_id = $${paramCount++}`);
      values.push(filters.projectId);
    }

    if (filters.eventType) {
      conditions.push(`event_type = $${paramCount++}`);
      values.push(filters.eventType);
    }

    if (filters.startDate) {
      conditions.push(`created_at >= $${paramCount++}`);
      values.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push(`created_at <= $${paramCount++}`);
      values.push(filters.endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `SELECT COUNT(*) as count FROM events ${whereClause}`;
    const result = await this.pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const query = 'DELETE FROM events WHERE created_at < $1';
    const result = await this.pool.query(query, [date]);
    return result.rowCount || 0;
  }
}
