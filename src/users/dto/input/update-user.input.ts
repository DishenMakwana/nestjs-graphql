import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field()
  @IsNotEmpty()
  userId: string;

  @Field(() => Int)
  @IsOptional()
  @IsNotEmpty()
  age?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isSubscribed?: boolean;
}
