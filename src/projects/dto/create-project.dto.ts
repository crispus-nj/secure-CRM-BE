import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsNotEmpty()
  status: string = 'Active';

  @IsOptional()
  startDate: Date;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  assignedUsers?: number[];
}
