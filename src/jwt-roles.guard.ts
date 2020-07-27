import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class JwtRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Set<string>>('roles', context.getHandler());

    if (roles && roles.size) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return this.matchRoles(roles, user.roles ?? []);
    }

    return true;
  }

  private matchRoles(roles: Set<string>, userRoles: string[]) {
    return userRoles.some(role => roles.has(role));
  }
}
