import { ApiKey } from '../types';

export class ApiKeyModel implements ApiKey {
  id: string;
  projectId: string;
  key: string;
  name: string;
  isActive: boolean;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: ApiKey) {
    this.id = data.id;
    this.projectId = data.projectId;
    this.key = data.key;
    this.name = data.name;
    this.isActive = data.isActive;
    this.lastUsedAt = data.lastUsedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromDatabase(row: any): ApiKeyModel {
    return new ApiKeyModel({
      id: row.id,
      projectId: row.project_id,
      key: row.key,
      name: row.name,
      isActive: row.is_active,
      lastUsedAt: row.last_used_at ? new Date(row.last_used_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  toJSON(): Omit<ApiKey, 'key'> & { keyPreview: string } {
    return {
      id: this.id,
      projectId: this.projectId,
      keyPreview: this.key.substring(0, 8) + '...',
      name: this.name,
      isActive: this.isActive,
      lastUsedAt: this.lastUsedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
