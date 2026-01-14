import api from './api';
import { MetricAggregation, MetricSummary } from '../types';

export const metricService = {
  async getSummary(projectId: string, timeWindow: string = '1h', hours: number = 24): Promise<MetricSummary[]> {
    const response = await api.get(`/metrics/${projectId}/summary`, {
      params: { timeWindow, hours },
    });
    return response.data.data;
  },

  async getTimeSeries(
    projectId: string,
    metricType: string,
    timeWindow: string,
    startDate: Date,
    endDate: Date
  ): Promise<MetricAggregation[]> {
    const response = await api.get(`/metrics/${projectId}/timeseries`, {
      params: {
        metricType,
        timeWindow,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return response.data.data;
  },

  async query(params: {
    projectId: string;
    metricType?: string;
    timeWindow?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<MetricAggregation[]> {
    const response = await api.get(`/metrics/${params.projectId}`, {
      params: {
        ...params,
        startDate: params.startDate?.toISOString(),
        endDate: params.endDate?.toISOString(),
      },
    });
    return response.data.data;
  },
};
