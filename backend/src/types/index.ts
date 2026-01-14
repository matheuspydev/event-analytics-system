export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  projectId: string;
  key: string;
  name: string;
  isActive: boolean;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
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
}

export interface MetricAggregation {
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
}

export interface Alert {
  id: string;
  projectId: string;
  name: string;
  condition: {
    metric: string;
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
    threshold: number;
    timeWindow: string;
  };
  webhookUrl: string;
  isActive: boolean;
  lastTriggeredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertHistory {
  id: string;
  alertId: string;
  triggeredAt: Date;
  value: number;
  resolved: boolean;
  resolvedAt: Date | null;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
}

export interface CreateEventDTO {
  projectId: string;
  eventType: string;
  data: Record<string, any>;
  metadata?: {
    userAgent?: string;
    ip?: string;
  };
}

export interface CreateApiKeyDTO {
  projectId: string;
  name: string;
}

export interface MetricsQuery {
  projectId: string;
  startDate?: Date;
  endDate?: Date;
  metricType?: string;
  timeWindow?: '1min' | '5min' | '1h' | '1d';
  groupBy?: string;
}
