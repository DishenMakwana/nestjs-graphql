import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserType } from '../types';
import { GqlExecutionContext } from '@nestjs/graphql';

type CurrentUserResponse = string | number | AuthUserType | null;

export const CurrentUser = createParamDecorator(
  (
    data: string | undefined,
    context: ExecutionContext
  ): CurrentUserResponse => {
    const ctx = GqlExecutionContext.create(context);
    const gqlRequest = ctx.getContext().req;

    if (gqlRequest) {
      return data ? gqlRequest.user[data] : gqlRequest.user;
    }

    return null;
  }
);
