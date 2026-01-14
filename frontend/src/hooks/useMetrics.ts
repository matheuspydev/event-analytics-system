import { useState, useEffect } from 'react';
import { metricService } from '../services/metricService';
import { MetricSummary, MetricAggregation } from '../types';

export function useMetrics(projectId: string | null) {
  const [summary, setSummary] = useState<MetricSummary[]>([]);
  const [timeSeries, setTimeSeries] = useState<MetricAggregation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const summaryData = await metricService.getSummary(projectId, '1h', 24);
        setSummary(summaryData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, [projectId]);

  const fetchTimeSeries = async (
    metricType: string,
    timeWindow: string,
    startDate: Date,
    endDate: Date
  ) => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const data = await metricService.getTimeSeries(projectId, metricType, timeWindow, startDate, endDate);
      setTimeSeries(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch time series');
    } finally {
      setLoading(false);
    }
  };

  return { summary, timeSeries, loading, error, fetchTimeSeries };
}
