import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prisma, Role } from '@prisma/client';

@ObjectType()
export class UserEntity implements Prisma.UserUncheckedCreateInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => String)
  role: Role;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
