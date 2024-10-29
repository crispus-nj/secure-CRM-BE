import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthenticationGuard } from 'src/auth/guards/jwt-authentication.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('projects')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('Admin')
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
    return this.projectsService.create(createProjectDto, req);
  }

  @Get()
  @Roles('Admin', 'Project Manager', 'Engineer')
  findAll(@Req() req: any) {
    return this.projectsService.findAll(req);
  }

  @Get(':id')
  @Roles('Admin', 'Project Manager', 'Engineer')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.projectsService.findOne(+id, req);
  }

  @Patch(':id')
  @Roles('Admin', 'Project Manager')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: any,
  ) {
    return this.projectsService.update(+id, updateProjectDto, req);
  }

  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
