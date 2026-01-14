import { ProjectRepository } from '../repositories/ProjectRepository';
import { CreateProjectDTO, UpdateProjectDTO } from '../types';
import { ProjectModel } from '../models/Project';

export class ProjectService {
  constructor(private projectRepo: ProjectRepository) {}

  async createProject(data: CreateProjectDTO): Promise<ProjectModel> {
    return this.projectRepo.create(data);
  }

  async getProject(id: string): Promise<ProjectModel> {
    return this.projectRepo.findById(id);
  }

  async listProjects(limit: number = 50, offset: number = 0): Promise<{ projects: ProjectModel[]; total: number }> {
    const [projects, total] = await Promise.all([
      this.projectRepo.findAll(limit, offset),
      this.projectRepo.count(),
    ]);

    return { projects, total };
  }

  async updateProject(id: string, data: UpdateProjectDTO): Promise<ProjectModel> {
    return this.projectRepo.update(id, data);
  }

  async deleteProject(id: string): Promise<void> {
    await this.projectRepo.delete(id);
  }
}
