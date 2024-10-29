import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // Create a new user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Create a new user instance
      const user = this.userRepository.create(createUserDto);

      if (createUserDto.roleId) {
        // Find the role by ID
        const role = await this.roleRepository.findOne({
          where: { id: createUserDto.roleId },
        });
        if (!role) {
          throw new Error(`Role not found`);
        }
        // Assign the role to the user
        user.role = role;
      }

      // Hash the user password
      user.password = await bcrypt.hash(user.password, 10);

      // Save the user
      await this.userRepository.save(user);

      // Return the user
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get all users
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        relations: ['role'],
        order: { id: 'DESC' },
      }); // Get all users with their roles
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get a user by ID
  async findUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      }); // Get a user by ID with their role
      if (!user) {
        throw new Error(`Account not found`);
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // find a user by email
  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['role'],
      }); // Get a user by email with their role
      if (!user) {
        throw new Error(`Invalid email or password provided!`);
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update user details
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // Find the user by ID
      const user = await this.findUserById(id);

      if (updateUserDto.roleId) {
        // Find the role by ID
        const role = await this.roleRepository.findOne({
          where: { id: updateUserDto.roleId },
        });
        if (!role) {
          throw new Error(`Role not found`);
        }
        // Assign the role to the user
        user.role = role;
      }

      // Update the user details
      Object.assign(user, updateUserDto);

      // if the password is provided, hash it
      if (updateUserDto.password) {
        user.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      // Save the user
      await this.userRepository.save(user);

      // Return the user
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Remove a user
  async deleteUser(id: number): Promise<void> {
    try {
      const result = await this.userRepository.delete(id); // Remove a user
      if (result.affected === 0) {
        throw new Error(`User not found`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // create the role
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      // Create a new user instance
      const role = this.roleRepository.create(createRoleDto);

      // Save the user
      await this.roleRepository.save(role);

      // Return the user
      return role;
    } catch (error) {
      throw new Error(error.message);
    }
  }

   // Get all users
   async listRoles(): Promise<Role[]> {
    try {
      return await this.roleRepository.find({}); // Get all users with their roles
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }
}
