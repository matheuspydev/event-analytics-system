export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  projectId: string;
  keyPreview: string;
  name: string;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  projectId: string;
  eventType: string;
  data: Record<string, any>;
  metadata: {
    userAgent?: string;
    ip?: string;
    timestamp: string;
  };
  createdAt: string;
}

export interface MetricAggregation {
  id: string;
  projectId: string;
  metricType: string;
  timeWindow: '1min' | '5min' | '1h' | '1d';
  timestamp: string;
  count: number;
  sum: number | null;
  avg: number | null;
  min: number | null;
  max: number | null;
  data: Record<string, any>;
  createdAt: string;
}

export interface MetricSummary {
  metric_type: string;
  total_count: string;
  overall_avg: string | null;
  overall_min: string | null;
  overall_max: string | null;
}
