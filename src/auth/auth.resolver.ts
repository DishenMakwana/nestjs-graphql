import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  ChangePasswordResponse,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResponse,
  ResetPasswordResponse,
  VerifyOtpResponse,
} from './dto';
import {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from './dto';
import { Auth, CurrentUser, SuccessMessage } from '../common/decorators';
import { AuthUserType } from '../common/types';
import { Role } from '@prisma/client';
import { message } from '../common/assets';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @SuccessMessage(message.user.SUCCESS_LOGIN)
  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @SuccessMessage(message.user.SUCCESS_LOGOUT)
  @Mutation(() => LogoutResponse)
  @Auth({
    roles: [Role.admin, Role.user],
  })
  async logout(@CurrentUser() user: AuthUserType) {
    return this.authService.logout(user);
  }

  @SuccessMessage(message.user.FORGOT_PASSWORD)
  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput
  ) {
    return this.authService.forgotPassword(forgotPasswordInput);
  }

  @SuccessMessage(message.user.OTP_VERIFIED)
  @Mutation(() => VerifyOtpResponse)
  async verifyForgotPasswordOtp(
    @Args('verifyOtpInput') verifyOtpInput: VerifyOtpInput
  ) {
    return this.authService.verifyForgotPasswordOtp(verifyOtpInput);
  }

  @SuccessMessage(message.user.SUCCESS_PASSWORD_CHANGED)
  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput
  ) {
    return this.authService.resetPassword(resetPasswordInput);
  }

  @Auth({
    roles: [Role.admin, Role.user],
  })
  @SuccessMessage(message.user.SUCCESS_PASSWORD_CHANGED)
  @Mutation(() => ChangePasswordResponse)
  async changePassword(
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
    @CurrentUser() authUser: AuthUserType
  ) {
    return this.authService.changePassword(authUser, changePasswordInput);
  }
}
