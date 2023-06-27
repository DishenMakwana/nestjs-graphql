import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { message } from '../../common/assets';

@InputType()
export class LoginInput {
  @Field({
    defaultValue: 'admin@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: message.validate.email })
  email: string;

  @Field({
    defaultValue: 'Admin@123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  password: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field({
    defaultValue: 'admin@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: message.validate.email })
  email: string;
}

@InputType()
export class VerifyOtpInput extends ForgotPasswordInput {
  @Field({
    defaultValue: '1234',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 4)
  otp: string;
}

@InputType()
export class ResetPasswordInput extends VerifyOtpInput {
  @Field({
    defaultValue: 'Admin@123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  @Matches(/^(?=.*\d)(?=.*[!@#$%.^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/, {
    message: message.validate.password,
  })
  password: string;
}

@InputType()
export class ChangePasswordInput {
  @Field({
    defaultValue: 'Admin@123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  @Matches(/^(?=.*\d)(?=.*[!@#$%.^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/, {
    message: message.validate.password,
  })
  currentPassword: string;

  @Field({
    defaultValue: 'Admin@123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  @Matches(/^(?=.*\d)(?=.*[!@#$%.^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/, {
    message: message.validate.password,
  })
  newPassword: string;
}
