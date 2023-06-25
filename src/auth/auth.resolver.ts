import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/response.dto';
import { LoginInput } from './dto/request.dto';
import { Auth, CurrentUser } from '../common/decorators';
import { AuthUserType } from '../common/types';
import { Role } from '@prisma/client';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => Boolean)
  @Auth({
    roles: [Role.admin, Role.user],
  })
  async logout(@CurrentUser() user: AuthUserType) {
    return this.authService.logout(user);
  }
}
