import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUserType, Payload } from '../../common/types';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtATStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: configService.getOrThrow<string>('ACCESS_TOKEN_EXPIRES_IN'),
      //   logging: true,
    });
  }

  async validate(request: Request, payload: Payload): Promise<AuthUserType> {
    const access_token = request
      .get('authorization')
      .replace('Bearer ', '')
      .trim();

    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      ...user,
      access_token,
    };
  }
}
