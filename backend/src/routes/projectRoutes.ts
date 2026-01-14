import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { ProjectService } from '../services/ProjectService';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { pool } from '../config/database';
import { validate } from '../middlewares/validator';
import { createProjectSchema, updateProjectSchema, projectIdSchema } from '../validators/projectValidator';

const router = Router();

// Initialize dependencies
const projectRepo = new ProjectRepository(pool);
const projectService = new ProjectService(projectRepo);
const projectController = new ProjectController(projectService);

router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/', projectController.listProjects);
router.get('/:id', validate(projectIdSchema, 'params'), projectController.getProject);
router.put('/:id', validate(projectIdSchema, 'params'), validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', validate(projectIdSchema, 'params'), projectController.deleteProject);

export default router;
