import { MetricRepository } from '../repositories/MetricRepository';
import { MetricsQuery } from '../types';
import { MetricAggregationModel } from '../models/MetricAggregation';

export class MetricService {
  constructor(private metricRepo: MetricRepository) {}

  async queryMetrics(filters: MetricsQuery): Promise<MetricAggregationModel[]> {
    return this.metricRepo.query(filters);
  }

  async getSummary(projectId: string, timeWindow: '1min' | '5min' | '1h' | '1d', hours: number = 24): Promise<any> {
    return this.metricRepo.getSummary(projectId, timeWindow, hours);
  }

  async getTimeSeries(
    projectId: string,
    metricType: string,
    timeWindow: '1min' | '5min' | '1h' | '1d',
    startDate: Date,
    endDate: Date
  ): Promise<MetricAggregationModel[]> {
    return this.metricRepo.getTimeSeries(projectId, metricType, timeWindow, startDate, endDate);
  }
}
