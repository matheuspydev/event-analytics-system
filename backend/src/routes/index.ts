import { Router } from 'express';
import projectRoutes from './projectRoutes';
import eventRoutes from './eventRoutes';
import metricRoutes from './metricRoutes';
import apiKeyRoutes from './apiKeyRoutes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Analytics Platform API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/projects', projectRoutes);
router.use('/events', eventRoutes);
router.use('/metrics', metricRoutes);
router.use('/keys', apiKeyRoutes);

export default router;
