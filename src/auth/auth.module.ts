import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtATStrategy } from './strategies/jwt-at.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: '1d' },
      secret: 'secret',
    }),
  ],
  providers: [AuthService, AuthResolver, JwtATStrategy],
})
export class AuthModule {}
