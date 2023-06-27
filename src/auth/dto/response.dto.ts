import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  role: string;
}

@ObjectType()
export class CustomResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@ObjectType()
export class Login {
  @Field()
  access_token: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class LoginResponse extends CustomResponse {
  @Field(() => Login)
  result: Login;
}

@ObjectType()
export class LogoutResponse extends CustomResponse {}

@ObjectType()
export class ForgotPasswordResponse extends CustomResponse {}

@ObjectType()
export class VerifyOtpResponse extends CustomResponse {}

@ObjectType()
export class ResetPasswordResponse extends CustomResponse {}

@ObjectType()
export class ChangePasswordResponse extends CustomResponse {}
