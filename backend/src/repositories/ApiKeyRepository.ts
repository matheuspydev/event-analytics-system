import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { ApiKeyModel } from '../models/ApiKey';
import { CreateApiKeyDTO } from '../types';
import { NotFoundError } from '../utils/errors';

export class ApiKeyRepository {
  constructor(private pool: Pool) {}

  private generateApiKey(): string {
    return `ak_${randomBytes(32).toString('hex')}`;
  }

  async create(data: CreateApiKeyDTO): Promise<ApiKeyModel> {
    const id = uuidv4();
    const key = this.generateApiKey();
    
    const query = `
      INSERT INTO api_keys (id, project_id, key, name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [id, data.projectId, key, data.name];
    const result = await this.pool.query(query, values);
    return ApiKeyModel.fromDatabase(result.rows[0]);
  }

  async findByKey(key: string): Promise<ApiKeyModel> {
    const query = 'SELECT * FROM api_keys WHERE key = $1 AND is_active = true';
    const result = await this.pool.query(query, [key]);
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Invalid API key');
    }
    
    return ApiKeyModel.fromDatabase(result.rows[0]);
  }

  async findByProjectId(projectId: string): Promise<ApiKeyModel[]> {
    const query = `
      SELECT * FROM api_keys
      WHERE project_id = $1
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query, [projectId]);
    return result.rows.map((row) => ApiKeyModel.fromDatabase(row));
  }

  async updateLastUsed(id: string): Promise<void> {
    const query = 'UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = $1';
    await this.pool.query(query, [id]);
  }

  async deactivate(id: string): Promise<void> {
    const query = 'UPDATE api_keys SET is_active = false WHERE id = $1 RETURNING id';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundError(`API key with id ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM api_keys WHERE id = $1 RETURNING id';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundError(`API key with id ${id} not found`);
    }
  }
}
