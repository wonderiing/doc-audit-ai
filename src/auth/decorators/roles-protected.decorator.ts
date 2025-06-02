import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../interfaces/user-role.interface';

export const META_ROLES = 'roles'

export const RolesProtected = (...roles: UserRoles[]) => SetMetadata('roles', roles);
