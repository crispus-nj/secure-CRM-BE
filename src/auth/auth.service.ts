/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate a user by email and password
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Login a user
  async login(user: {
    email: string;
    id: number;
    role: { name: string } | null;
    firstName: string;
    lastName: string;
  }) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role?.name,
      name: `${user.firstName} ${user.lastName}`,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  // Register a new user
  async register(user: CreateUserDto) {
    return await this.usersService.createUser(user);
  }
}
