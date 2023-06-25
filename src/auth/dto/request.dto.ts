import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
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
