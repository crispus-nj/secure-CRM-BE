import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsMobilePhone,
  MinLength,
  IsOptional,
  IsNumber,
} from 'class-validator';

// creation of the user dto class
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsMobilePhone('en-KE')
  @IsPhoneNumber('KE')
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  kraPin: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString({ each: true })
  @IsOptional()
  attachments: string[];

  @IsNumber()
  @IsOptional()
  roleId: number;
}
