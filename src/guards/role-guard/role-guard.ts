import { UserRole, ROLES_KEY } from './../../decorators/roles.decorator';
// roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the roles required for this specific route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. If no roles are defined on the route, let it pass
    if (!requiredRoles) {
      return true;
    }

    // 3. Get the user from the request (injected by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    // 4. Verify the user exists and has the right role
    if (!user || !requiredRoles.includes(user.role as UserRole)) {
      throw new ForbiddenException(
        'You do not have the required role to access this resource',
      );
    }

    return true;
  }
}
