import { ApiKeyRepository } from '../repositories/ApiKeyRepository';
import { CreateApiKeyDTO } from '../types';
import { ApiKeyModel } from '../models/ApiKey';

export class ApiKeyService {
  constructor(private apiKeyRepo: ApiKeyRepository) {}

  async createApiKey(data: CreateApiKeyDTO): Promise<ApiKeyModel> {
    return this.apiKeyRepo.create(data);
  }

  async getProjectApiKeys(projectId: string): Promise<ApiKeyModel[]> {
    return this.apiKeyRepo.findByProjectId(projectId);
  }

  async revokeApiKey(id: string): Promise<void> {
    await this.apiKeyRepo.deactivate(id);
  }

  async deleteApiKey(id: string): Promise<void> {
    await this.apiKeyRepo.delete(id);
  }
}
