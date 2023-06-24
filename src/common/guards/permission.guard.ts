import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const [requiredPermissions, isPublic] = [
      this.reflector.getAllAndOverride<any[]>('permissions', [
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

    const userRole: any = request.user.role;

    // Admin can do everything
    if (userRole === 'admin') {
      return true;
    }

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return false;
    }

    const userPermission: any = request.user.permission;

    return requiredPermissions.includes(userPermission);
  }
}
