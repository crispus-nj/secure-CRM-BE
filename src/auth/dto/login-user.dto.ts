import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

// login user dto class
export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
