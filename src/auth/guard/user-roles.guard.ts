import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/roles-protected.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRolesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const req = context.switchToHttp().getRequest()

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())


    if (!validRoles) return true
    if (validRoles.length[0]) return true

    
    const user = req.user as User
    
    if (!validRoles.every(role => user.roles.includes(role))) throw new ForbiddenException(`Permissions required ${validRoles}`)

    return true
  }
}
