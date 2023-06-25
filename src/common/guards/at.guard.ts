import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ATGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  getRequest<T = any>(context: ExecutionContext): T {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  // canActivate(
  //   context: ExecutionContext
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   const isPublic = this.reflector.get<boolean>(
  //     'isPublic',
  //     context.getHandler()
  //   );

  //   if (isPublic) {
  //     return Promise.resolve(super.canActivate(context))
  //       .then(() => true)
  //       .catch(() => true);
  //   }

  //   return super.canActivate(context);
  // }
}
