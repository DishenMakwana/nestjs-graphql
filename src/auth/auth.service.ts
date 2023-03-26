import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/users';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  validate(email: string, password: string): User | null {
    const user = this.usersService.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const passwordIsValid = user.password === password;

    return passwordIsValid ? user : null;
  }

  login(user: User): { access_token: string } {
    const payload = {
      email: user.email,
      sub: user.userId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  verify(token: string): User {
    const decode = this.jwtService.verify(token, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });

    const user = this.usersService.getUserByEmail(decode.email);

    if (!user) {
      throw new Error('Unable to get user from decoded token.');
    }

    return user;
  }
}
