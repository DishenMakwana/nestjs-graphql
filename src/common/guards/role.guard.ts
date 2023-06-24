import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const [requiredRoles, isPublic] = [
      this.reflector.getAllAndOverride<any[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]),
      this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]),
    ];

    const request = context.switchToHttp().getRequest();

    if (isPublic && !request.user) {
      return true;
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      return false;
    }

    const userRole: any = request.user.role;

    return requiredRoles.includes(userRole);
  }
}
