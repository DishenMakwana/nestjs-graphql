import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/request.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthUserType, Tokens } from '../common/types';
import { UserForToken } from './types';
import { message } from '../common/assets';
import { AuthTransformer } from './auth.transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly authTransformer: AuthTransformer
  ) {}

  async login(loginInput: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginInput.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      throw new ForbiddenException(message.user.INVALID_CRED);
    }

    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ForbiddenException(message.user.INVALID_CRED);
    }

    const { access_token }: Tokens = await this.getToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return this.authTransformer.transformUser(user, access_token);
  }

  async logout(authUser: AuthUserType) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new ForbiddenException(message.user.USER_NOT_FOUND);
    }

    return true;
  }

  private async getToken(data: UserForToken): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: data.id,
          email: data.email,
          role: data.role,
        },
        {
          secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.getOrThrow<string>(
            'ACCESS_TOKEN_EXPIRES_IN'
          ),
        }
      ),

      this.jwtService.signAsync(
        {
          sub: data.id,
          email: data.email,
          role: data.role,
        },
        {
          secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.getOrThrow<string>(
            'REFRESH_TOKEN_EXPIRES_IN'
          ),
        }
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
