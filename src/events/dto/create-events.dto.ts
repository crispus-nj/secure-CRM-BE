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
export class CreateEventsDto {
  
  @IsString()
  @IsNotEmpty()
  name: string;

}
