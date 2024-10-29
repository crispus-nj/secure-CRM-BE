import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new project and assign users if provided
  async create(createProjectDto: CreateProjectDto, req: any): Promise<Project> {
    try {
      // Start by creating a project instance using provided details
      const project = this.projectRepository.create({
        name: createProjectDto.name,
        description: createProjectDto.description || '',
        location: createProjectDto.location || '',
        status: createProjectDto.status || 'Active',
        startDate: createProjectDto.startDate,
        endDate: createProjectDto.endDate,
      });

      // If there are users assigned to the project, fetch their entities
      if (createProjectDto.assignedUsers?.length) {
        const users = await this.userRepository.findByIds(
          createProjectDto.assignedUsers,
        );

        // Check if all provided user IDs were found
        if (users.length !== createProjectDto.assignedUsers.length) {
          throw new Error('One or more assigned users not found');
        }

        project.assignedUsers = users;
      }

      // Record the user who is creating the project
      project.createdBy = req.user;

      // Save and return the newly created project
      return await this.projectRepository.save(project);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Retrieve all projects, filtered by user role
  async findAll(req: any): Promise<Project[]> {
    try {
      // Admins can see all projects
      if (req.user.role.name === 'Admin') {
        return await this.projectRepository.find({
          relations: ['assignedUsers'],
        });
      } else {
        // Non-admins only see projects they are assigned to
        return await this.projectRepository
          .createQueryBuilder('project')
          .leftJoinAndSelect('project.assignedUsers', 'user')
          .where('user.id = :userId', { userId: req.user.id })
          .getMany();
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get a specific project, ensuring the user has access
  async findOne(id: number, req: any): Promise<Project> {
    try {
      // Look for the project by its ID and include assigned users
      const project = await this.projectRepository.findOne({
        where: { id },
        relations: ['assignedUsers'],
      });

      if (!project) {
        throw new NotFoundException(`Project not found!`);
      }

      // Admins have access to all projects
      if (req.user.role.name === 'Admin') {
        return project;
      }

      // Non-admins can only access projects they are assigned to
      const isUserAssigned = project.assignedUsers.some(
        (user) => user.id === req.user.id,
      );

      if (isUserAssigned) {
        return project;
      } else {
        throw new ForbiddenException(`You do not have access to this project`);
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred: ' + error.message);
      }
    }
  }

  // Update an existing project
  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    req: any,
  ): Promise<Project> {
    try {
      // Find the project by its ID
      const project = await this.projectRepository.findOne({
        where: { id },
        relations: ['assignedUsers'],
      });
      if (!project) {
        throw new NotFoundException(`Project not found`);
      }

      // Check if the user has the right to update this project
      if (req.user.role.name !== 'Admin') {
        const isUserAssigned = project.assignedUsers.some(
          (user) => user.id === req.user.id,
        );
        if (!isUserAssigned) {
          throw new ForbiddenException(
            `You do not have access to this project`,
          );
        }
      }

      // Update project details if new data is provided
      project.name = updateProjectDto.name || project.name;
      project.description = updateProjectDto.description || project.description;
      project.location = updateProjectDto.location || project.location;
      project.status = updateProjectDto.status || project.status;
      project.startDate = updateProjectDto.startDate || project.startDate;
      project.endDate = updateProjectDto.endDate || project.endDate;

      // Handle the reassignment of users if provided
      if (updateProjectDto.assignedUsers?.length) {
        const users = await this.userRepository.findByIds(
          updateProjectDto.assignedUsers,
        );

        if (users.length !== updateProjectDto.assignedUsers.length) {
          throw new Error('One or more assigned users not found');
        }

        project.assignedUsers = users;
      }

      // Save the updated project details
      return await this.projectRepository.save(project);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred: ' + error.message);
      }
    }
  }

  // Delete a project by its ID
  async remove(id: number): Promise<Project> {
    try {
      // Find the project to ensure it exists before deletion
      const project = await this.projectRepository.findOne({ where: { id } });
      if (!project) {
        throw new Error(`Project not found`);
      }

      // Proceed with deletion
      await this.projectRepository.delete(id);
      return project;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
