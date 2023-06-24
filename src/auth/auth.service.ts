import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login.input';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(loginInput: LoginInput) {
    const user = await this.usersService.findOne(loginInput.username);

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        username: user.username,
      }),
      user,
    };
  }

  async signup(loginInput: LoginInput) {
    const user = await this.usersService.findOne(loginInput.username);

    if (user) {
      throw new Error('User already exists');
    }

    const password = await bcrypt.hash(loginInput.password, 10);

    return this.usersService.create({
      ...loginInput,
      password,
    });
  }
}
