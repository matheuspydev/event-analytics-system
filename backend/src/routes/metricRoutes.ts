import { Router } from 'express';
import { MetricController } from '../controllers/MetricController';
import { MetricService } from '../services/MetricService';
import { MetricRepository } from '../repositories/MetricRepository';
import { pool } from '../config/database';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Initialize dependencies
const metricRepo = new MetricRepository(pool);
const metricService = new MetricService(metricRepo);
const metricController = new MetricController(metricService);

// All metric routes require authentication
router.use(authenticate);

router.get('/:projectId', metricController.queryMetrics);
router.get('/:projectId/summary', metricController.getSummary);
router.get('/:projectId/timeseries', metricController.getTimeSeries);

export default router;
