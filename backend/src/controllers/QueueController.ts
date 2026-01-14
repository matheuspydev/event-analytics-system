import { Request, Response, NextFunction } from 'express';
import { QueueService } from '../services/QueueService';

export class QueueController {
  constructor(private queueService: QueueService) {}

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.queueService.getQueueStats();
      res.json({
        status: 'success',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}
