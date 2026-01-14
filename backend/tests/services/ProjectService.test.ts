import { ProjectService } from '../../src/services/ProjectService';
import { ProjectRepository } from '../../src/repositories/ProjectRepository';
import { ProjectModel } from '../../src/models/Project';

// Mock the repository
jest.mock('../../src/repositories/ProjectRepository');

describe('ProjectService', () => {
  let projectService: ProjectService;
  let mockProjectRepo: jest.Mocked<ProjectRepository>;

  beforeEach(() => {
    mockProjectRepo = new ProjectRepository(null as any) as jest.Mocked<ProjectRepository>;
    projectService = new ProjectService(mockProjectRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const mockProject = {
        id: '123',
        name: 'Test Project',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProjectRepo.create = jest.fn().mockResolvedValue(new ProjectModel(mockProject));

      const result = await projectService.createProject({
        name: 'Test Project',
        description: 'Test Description',
      });

      expect(result.name).toBe('Test Project');
      expect(mockProjectRepo.create).toHaveBeenCalledWith({
        name: 'Test Project',
        description: 'Test Description',
      });
    });
  });

  describe('getProject', () => {
    it('should return a project by id', async () => {
      const mockProject = {
        id: '123',
        name: 'Test Project',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProjectRepo.findById = jest.fn().mockResolvedValue(new ProjectModel(mockProject));

      const result = await projectService.getProject('123');

      expect(result.id).toBe('123');
      expect(mockProjectRepo.findById).toHaveBeenCalledWith('123');
    });
  });

  describe('listProjects', () => {
    it('should return paginated projects', async () => {
      const mockProjects = [
        {
          id: '1',
          name: 'Project 1',
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Project 2',
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockProjectRepo.findAll = jest.fn().mockResolvedValue(mockProjects.map(p => new ProjectModel(p)));
      mockProjectRepo.count = jest.fn().mockResolvedValue(2);

      const result = await projectService.listProjects(50, 0);

      expect(result.projects).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });
});
