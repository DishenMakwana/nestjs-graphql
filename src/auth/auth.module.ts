import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtATStrategy, JwtRTStrategy } from './strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthTransformer } from './auth.transformer';
import { AuthEvent } from './event';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'ACCESS_TOKEN_EXPIRES_IN'
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AuthTransformer,
    AuthResolver,
    JwtATStrategy,
    JwtRTStrategy,
    AuthEvent,
  ],
})
export class AuthModule {}
