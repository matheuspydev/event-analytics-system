import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { MetricAggregationModel } from '../models/MetricAggregation';
import { MetricsQuery } from '../types';

export interface MetricData {
  projectId: string;
  metricType: string;
  timeWindow: '1min' | '5min' | '1h' | '1d';
  timestamp: Date;
  count: number;
  sum?: number;
  avg?: number;
  min?: number;
  max?: number;
  data?: Record<string, any>;
}

export class MetricRepository {
  constructor(private pool: Pool) {}

  async upsert(metric: MetricData): Promise<MetricAggregationModel> {
    const id = uuidv4();
    
    const query = `
      INSERT INTO metric_aggregations 
        (id, project_id, metric_type, time_window, timestamp, count, sum, avg, min, max, data)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (project_id, metric_type, time_window, timestamp)
      DO UPDATE SET
        count = metric_aggregations.count + EXCLUDED.count,
        sum = COALESCE(metric_aggregations.sum, 0) + COALESCE(EXCLUDED.sum, 0),
        avg = (COALESCE(metric_aggregations.sum, 0) + COALESCE(EXCLUDED.sum, 0)) / 
              (metric_aggregations.count + EXCLUDED.count),
        min = LEAST(metric_aggregations.min, EXCLUDED.min),
        max = GREATEST(metric_aggregations.max, EXCLUDED.max),
        data = EXCLUDED.data
      RETURNING *
    `;

    const values = [
      id,
      metric.projectId,
      metric.metricType,
      metric.timeWindow,
      metric.timestamp,
      metric.count,
      metric.sum || null,
      metric.avg || null,
      metric.min || null,
      metric.max || null,
      metric.data ? JSON.stringify(metric.data) : null,
    ];

    const result = await this.pool.query(query, values);
    return MetricAggregationModel.fromDatabase(result.rows[0]);
  }

  async query(filters: MetricsQuery): Promise<MetricAggregationModel[]> {
    const conditions: string[] = ['project_id = $1'];
    const values: any[] = [filters.projectId];
    let paramCount = 2;

    if (filters.metricType) {
      conditions.push(`metric_type = $${paramCount++}`);
      values.push(filters.metricType);
    }

    if (filters.timeWindow) {
      conditions.push(`time_window = $${paramCount++}`);
      values.push(filters.timeWindow);
    }

    if (filters.startDate) {
      conditions.push(`timestamp >= $${paramCount++}`);
      values.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push(`timestamp <= $${paramCount++}`);
      values.push(filters.endDate);
    }

    const query = `
      SELECT * FROM metric_aggregations
      WHERE ${conditions.join(' AND ')}
      ORDER BY timestamp DESC
      LIMIT 1000
    `;

    const result = await this.pool.query(query, values);
    return result.rows.map((row) => MetricAggregationModel.fromDatabase(row));
  }

  async getSummary(projectId: string, timeWindow: '1min' | '5min' | '1h' | '1d', hours: number = 24): Promise<any> {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    const query = `
      SELECT 
        metric_type,
        SUM(count) as total_count,
        AVG(avg) as overall_avg,
        MIN(min) as overall_min,
        MAX(max) as overall_max
      FROM metric_aggregations
      WHERE project_id = $1
        AND time_window = $2
        AND timestamp >= $3
      GROUP BY metric_type
    `;

    const result = await this.pool.query(query, [projectId, timeWindow, startDate]);
    return result.rows;
  }

  async getTimeSeries(
    projectId: string,
    metricType: string,
    timeWindow: '1min' | '5min' | '1h' | '1d',
    startDate: Date,
    endDate: Date
  ): Promise<MetricAggregationModel[]> {
    const query = `
      SELECT * FROM metric_aggregations
      WHERE project_id = $1
        AND metric_type = $2
        AND time_window = $3
        AND timestamp >= $4
        AND timestamp <= $5
      ORDER BY timestamp ASC
    `;

    const result = await this.pool.query(query, [projectId, metricType, timeWindow, startDate, endDate]);
    return result.rows.map((row) => MetricAggregationModel.fromDatabase(row));
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const query = 'DELETE FROM metric_aggregations WHERE created_at < $1';
    const result = await this.pool.query(query, [date]);
    return result.rowCount || 0;
  }
}
