import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from './dto/request.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthUserType, ForgotPasswordEvent, Tokens } from '../common/types';
import { UserForToken } from './types';
import { Actions, event, message } from '../common/assets';
import { AuthTransformer } from './auth.transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  private readonly saltRounds: number = 10;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly authTransformer: AuthTransformer,
    private readonly eventEmitter: EventEmitter2
  ) {
    this.saltRounds = +this.configService.getOrThrow<number>('SALT_ROUNDS');
  }

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

    await this.prisma.log.create({
      data: {
        user_id: user.id,
        action_id: Actions.LOGOUT,
      },
    });
  }

  async forgotPassword(forgotPasswordInput: ForgotPasswordInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: forgotPasswordInput.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new ForbiddenException(message.user.USER_NOT_FOUND);
    }

    const newOTP: number = this.generateOTP();

    await this.prisma.user.update({
      data: {
        code: newOTP.toString(),
      },
      where: {
        id: user.id,
      },
    });

    //sent email to user
    try {
      const data: ForgotPasswordEvent = {
        email: forgotPasswordInput.email,
        otp: newOTP.toString(),
      };

      this.eventEmitter.emit(event.FORGOT_PASSWORD, data);
    } catch (e) {
      console.error('Email error: ', e);
    }

    await this.prisma.log.create({
      data: {
        user_id: user.id,
        action_id: Actions.FORGOT_PASSWORD,
      },
    });
  }

  async verifyForgotPasswordOtp(verifyOtpInput: VerifyOtpInput) {
    await this.otpValidate(verifyOtpInput);
  }

  async resetPassword(resetPasswordInput: ResetPasswordInput) {
    const user = await this.otpValidate(resetPasswordInput);

    if (user) {
      if (await bcrypt.compare(resetPasswordInput.password, user.password)) {
        throw new ForbiddenException(message.user.USE_DIFFERENT_PASSWORD);
      }

      await this.prisma.user.update({
        where: {
          email: resetPasswordInput.email,
        },
        data: {
          password: await bcrypt.hash(
            resetPasswordInput.password,
            this.saltRounds
          ),
          code: null,
        },
      });

      await this.prisma.log.create({
        data: {
          user_id: user.id,
          action_id: Actions.RESET_PASSWORD,
        },
      });
    }
  }

  async changePassword(
    authUser: AuthUserType,
    changePasswordInput: ChangePasswordInput
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
      select: {
        password: true,
      },
    });

    const isValidPassword = await bcrypt.compare(
      changePasswordInput.currentPassword,
      user.password
    );

    if (
      changePasswordInput.currentPassword === changePasswordInput.newPassword
    ) {
      throw new ForbiddenException(message.user.SAME_PASSWORD);
    }

    if (!isValidPassword) {
      throw new ForbiddenException(message.user.INVALID_CURRENT_PASSWORD);
    }

    await this.prisma.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        password: await bcrypt.hash(
          changePasswordInput.newPassword,
          this.saltRounds
        ),
      },
    });

    await this.prisma.log.create({
      data: {
        user_id: authUser.id,
        action_id: Actions.RESET_PASSWORD,
      },
    });
  }

  private async otpValidate(body: VerifyOtpInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        code: true,
        password: true,
      },
    });

    if (!user) {
      throw new ForbiddenException(message.user.INVALID_REQUEST);
    }

    if (user?.code !== body.otp) {
      throw new ForbiddenException(message.user.INVALID_OTP);
    }

    await this.prisma.log.create({
      data: {
        user_id: user.id,
        action_id: Actions.OTP_VERIFY,
      },
    });

    return user;
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

  private generateOTP = (): number => {
    return Math.floor(1000 + Math.random() * 9000);
  };
}
