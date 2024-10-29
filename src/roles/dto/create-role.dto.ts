import { IsString, IsNotEmpty, } from 'class-validator';

// creation of the role dto class
export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}
