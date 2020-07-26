import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtRolesGuard } from './jwt-roles.guard';
import { AuthGuard } from '@nestjs/passport';

export function JwtAccess(...roles: string[]): any {
  if (roles.length) {
    return applyDecorators(
      SetMetadata('roles', new Set(roles)),
      UseGuards(AuthGuard('jwt'), JwtRolesGuard),
    );
  }

  return applyDecorators(UseGuards(AuthGuard('jwt'), JwtRolesGuard));
}
