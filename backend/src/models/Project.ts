import { Project, CreateProjectDTO, UpdateProjectDTO } from '../types';

export class ProjectModel implements Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Project) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromDatabase(row: any): ProjectModel {
    return new ProjectModel({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  toJSON(): Project {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
