import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/ProjectService';
import { CreateProjectDTO, UpdateProjectDTO } from '../types';

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateProjectDTO = req.body;
      const project = await this.projectService.createProject(data);
      res.status(201).json({
        status: 'success',
        data: project.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const project = await this.projectService.getProject(id);
      res.json({
        status: 'success',
        data: project.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  listProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const { projects, total } = await this.projectService.listProjects(limit, offset);
      
      res.json({
        status: 'success',
        data: {
          projects: projects.map((p) => p.toJSON()),
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + projects.length < total,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateProjectDTO = req.body;
      const project = await this.projectService.updateProject(id, data);
      res.json({
        status: 'success',
        data: project.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.projectService.deleteProject(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
