import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  email: string;

  @Field(() => Int)
  age: number;

  @Field(() => Boolean, { nullable: true })
  isSubscribed?: boolean;

  @Field({ nullable: true })
  password?: string;
}
