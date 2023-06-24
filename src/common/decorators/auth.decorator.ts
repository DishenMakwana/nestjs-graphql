import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ATGuard } from '../guards/at.guard';
import { PermissionGuard, RolesGuard } from '../guards';

type Authorization = {
  roles?: any[];
  permissions?: any[];
};

export function Auth(authorization: Authorization): MethodDecorator {
  const { roles, permissions } = authorization;

  return applyDecorators(
    SetMetadata('roles', roles),
    SetMetadata('permissions', permissions),
    UseGuards(ATGuard, RolesGuard, PermissionGuard)
  );
}
