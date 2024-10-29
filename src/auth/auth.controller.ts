import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { IResponse } from 'src/models/response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login a user
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<IResponse> {
    try {
      const user = await this.authService.validateUser(
        loginUserDto.email,
        loginUserDto.password,
      );
      if (!user) {
        throw new HttpException(
          'Invalid email or password provided!',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const token = await this.authService.login(user);
      const loggedInUser = {
        ...user,
        ...token,
      };
      return {
        Status: 200,
        Message: 'Success',
        Payload: loggedInUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Register a new user
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    try {
      const user: User = await this.authService.register(createUserDto);
      delete user.password;
      return {
        Status: 200,
        Message: 'Success',
        Payload: user,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
