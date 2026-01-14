import { Request, Response, NextFunction } from 'express';
import { MetricService } from '../services/MetricService';
import { MetricsQuery } from '../types';

export class MetricController {
  constructor(private metricService: MetricService) {}

  queryMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: MetricsQuery = {
        projectId: req.params.projectId || (req.query.projectId as string),
        metricType: req.query.metricType as string,
        timeWindow: req.query.timeWindow as '1min' | '5min' | '1h' | '1d',
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      };
      
      const metrics = await this.metricService.queryMetrics(filters);
      
      res.json({
        status: 'success',
        data: metrics.map((m) => m.toJSON()),
      });
    } catch (error) {
      next(error);
    }
  };

  getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params;
      const timeWindow = (req.query.timeWindow as '1min' | '5min' | '1h' | '1d') || '1h';
      const hours = parseInt(req.query.hours as string) || 24;
      
      const summary = await this.metricService.getSummary(projectId, timeWindow, hours);
      
      res.json({
        status: 'success',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  };

  getTimeSeries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params;
      const metricType = req.query.metricType as string;
      const timeWindow = req.query.timeWindow as '1min' | '5min' | '1h' | '1d';
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);
      
      const timeSeries = await this.metricService.getTimeSeries(
        projectId,
        metricType,
        timeWindow,
        startDate,
        endDate
      );
      
      res.json({
        status: 'success',
        data: timeSeries.map((m) => m.toJSON()),
      });
    } catch (error) {
      next(error);
    }
  };
}
