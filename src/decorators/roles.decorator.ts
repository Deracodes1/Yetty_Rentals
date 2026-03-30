// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

/**
 * Use a union type instead of 'any' to ensure
 * you only pass valid roles defined in your system.
 */
export type UserRole = 'admin' | 'user';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
