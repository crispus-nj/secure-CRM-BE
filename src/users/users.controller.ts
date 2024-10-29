import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthenticationGuard } from 'src/auth/guards/jwt-authentication.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';

@Controller('users') //  route
@UseGuards(JwtAuthenticationGuard, RolesGuard) // guards for authentication and authorization (ensure the user is authenticated and has the required role)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // only users with the 'Admin' role can create a new user
  @Post()
  @Roles('Admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // only users with the 'Admin', 'Project Manager' role can get all users
  @Get()
  @Roles('Admin', 'Project Manager', 'Engineer')
  findAll() {
    return this.usersService.findAll();
  }

  // only users with the 'Admin', 'Project Manager' role can get a user by ID
  @Get(':id')
  @Roles('Admin', 'Project Manager')
  findOne(@Param('id') id: number) {
    return this.usersService.findUserById(id);
  }

  // only users with the 'Admin' role can update a user by ID
  @Patch(':id')
  @Roles('Admin')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // only users with the 'Admin' role can delete a user by ID
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  @Roles('Admin')
  @Post('createRole')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.usersService.createRole(createRoleDto);
  }

  @Roles('Admin')
  @Post('listroles')
  findAllRoles() {
    return this.usersService.listRoles();
  }
}
