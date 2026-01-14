import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { ProjectModel } from '../models/Project';
import { CreateProjectDTO, UpdateProjectDTO } from '../types';
import { NotFoundError } from '../utils/errors';

export class ProjectRepository {
  constructor(private pool: Pool) {}

  async create(data: CreateProjectDTO): Promise<ProjectModel> {
    const id = uuidv4();
    const query = `
      INSERT INTO projects (id, name, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [id, data.name, data.description || null];
    const result = await this.pool.query(query, values);
    return ProjectModel.fromDatabase(result.rows[0]);
  }

  async findById(id: string): Promise<ProjectModel> {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundError(`Project with id ${id} not found`);
    }
    
    return ProjectModel.fromDatabase(result.rows[0]);
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<ProjectModel[]> {
    const query = `
      SELECT * FROM projects
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await this.pool.query(query, [limit, offset]);
    return result.rows.map((row) => ProjectModel.fromDatabase(row));
  }

  async update(id: string, data: UpdateProjectDTO): Promise<ProjectModel> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE projects
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    
    if (result.rows.length === 0) {
      throw new NotFoundError(`Project with id ${id} not found`);
    }

    return ProjectModel.fromDatabase(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM projects WHERE id = $1 RETURNING id';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundError(`Project with id ${id} not found`);
    }
  }

  async count(): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM projects';
    const result = await this.pool.query(query);
    return parseInt(result.rows[0].count, 10);
  }
}
