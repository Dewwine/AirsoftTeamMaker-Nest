import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflecror: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const res = context.switchToHttp().getResponse();

    try {
      const requiredRoles: number[] = this.reflecror.getAllAndOverride(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles.includes(res.locals.profile.roleId)) {
        throw new HttpException('Role Forbidden', 403);
      }
      
      return true;
    } catch (e) {
      throw new HttpException('Role Forbidden', 403);
    }
  }
}
