import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import { ApiKeyRepository } from '../repositories/ApiKeyRepository';
import { pool } from '../config/database';

const apiKeyRepo = new ApiKeyRepository(pool);

declare global {
  namespace Express {
    interface Request {
      apiKey?: {
        id: string;
        projectId: string;
      };
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedError('API key is required');
    }

    const keyData = await apiKeyRepo.findByKey(apiKey);

    if (!keyData.isActive) {
      throw new UnauthorizedError('API key is inactive');
    }

    // Update last used (fire and forget)
    apiKeyRepo.updateLastUsed(keyData.id).catch(() => {
      // Silent fail for last used update
    });

    req.apiKey = {
      id: keyData.id,
      projectId: keyData.projectId,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return next();
  }

  authenticate(req, res, next);
}
