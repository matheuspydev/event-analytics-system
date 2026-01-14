import { Router } from 'express';
import { ApiKeyController } from '../controllers/ApiKeyController';
import { ApiKeyService } from '../services/ApiKeyService';
import { ApiKeyRepository } from '../repositories/ApiKeyRepository';
import { pool } from '../config/database';
import Joi from 'joi';
import { validate } from '../middlewares/validator';

const router = Router();

// Initialize dependencies
const apiKeyRepo = new ApiKeyRepository(pool);
const apiKeyService = new ApiKeyService(apiKeyRepo);
const apiKeyController = new ApiKeyController(apiKeyService);

const createApiKeySchema = Joi.object({
  projectId: Joi.string().uuid().required(),
  name: Joi.string().min(3).max(255).required(),
});

const apiKeyIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const projectIdSchema = Joi.object({
  projectId: Joi.string().uuid().required(),
});

router.post('/', validate(createApiKeySchema), apiKeyController.createApiKey);
router.get('/project/:projectId', validate(projectIdSchema, 'params'), apiKeyController.getProjectApiKeys);
router.patch('/:id/revoke', validate(apiKeyIdSchema, 'params'), apiKeyController.revokeApiKey);
router.delete('/:id', validate(apiKeyIdSchema, 'params'), apiKeyController.deleteApiKey);

export default router;
