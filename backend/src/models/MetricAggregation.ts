import { MetricAggregation } from '../types';

export class MetricAggregationModel implements MetricAggregation {
  id: string;
  projectId: string;
  metricType: string;
  timeWindow: '1min' | '5min' | '1h' | '1d';
  timestamp: Date;
  count: number;
  sum: number | null;
  avg: number | null;
  min: number | null;
  max: number | null;
  data: Record<string, any>;
  createdAt: Date;

  constructor(data: MetricAggregation) {
    this.id = data.id;
    this.projectId = data.projectId;
    this.metricType = data.metricType;
    this.timeWindow = data.timeWindow;
    this.timestamp = data.timestamp;
    this.count = data.count;
    this.sum = data.sum;
    this.avg = data.avg;
    this.min = data.min;
    this.max = data.max;
    this.data = data.data;
    this.createdAt = data.createdAt;
  }

  static fromDatabase(row: any): MetricAggregationModel {
    return new MetricAggregationModel({
      id: row.id,
      projectId: row.project_id,
      metricType: row.metric_type,
      timeWindow: row.time_window,
      timestamp: new Date(row.timestamp),
      count: parseInt(row.count, 10),
      sum: row.sum ? parseFloat(row.sum) : null,
      avg: row.avg ? parseFloat(row.avg) : null,
      min: row.min ? parseFloat(row.min) : null,
      max: row.max ? parseFloat(row.max) : null,
      data: row.data,
      createdAt: new Date(row.created_at),
    });
  }

  toJSON(): MetricAggregation {
    return {
      id: this.id,
      projectId: this.projectId,
      metricType: this.metricType,
      timeWindow: this.timeWindow,
      timestamp: this.timestamp,
      count: this.count,
      sum: this.sum,
      avg: this.avg,
      min: this.min,
      max: this.max,
      data: this.data,
      createdAt: this.createdAt,
    };
  }
}
