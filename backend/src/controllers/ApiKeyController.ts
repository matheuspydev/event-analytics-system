import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from '../services/ApiKeyService';
import { CreateApiKeyDTO } from '../types';

export class ApiKeyController {
  constructor(private apiKeyService: ApiKeyService) {}

  createApiKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateApiKeyDTO = req.body;
      const apiKey = await this.apiKeyService.createApiKey(data);
      
      // Return the full key only on creation
      res.status(201).json({
        status: 'success',
        data: {
          ...apiKey.toJSON(),
          key: apiKey.key, // Full key shown only once
        },
        message: 'Store this API key securely. It will not be shown again.',
      });
    } catch (error) {
      next(error);
    }
  };

  getProjectApiKeys = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params;
      const apiKeys = await this.apiKeyService.getProjectApiKeys(projectId);
      
      res.json({
        status: 'success',
        data: apiKeys.map((k) => k.toJSON()),
      });
    } catch (error) {
      next(error);
    }
  };

  revokeApiKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.apiKeyService.revokeApiKey(id);
      
      res.json({
        status: 'success',
        message: 'API key revoked successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteApiKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.apiKeyService.deleteApiKey(id);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
