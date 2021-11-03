import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ProfileModel } from 'src/profile/profile.model';
import { RoleModel } from 'src/role/role.model';
import { TeamModel } from 'src/team/team.model';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    try {
      const authHeader: string[] = req.headers.authorization.split(' ');
      const bearer: string = authHeader[0];
      const token: string = authHeader[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Not authorized');
      }

      const decoded = this.jwtService.verify(token);

      const profile: ProfileModel = await ProfileModel.findByPk(decoded.id, {
        include: [{ model: RoleModel }, { model: TeamModel }],
      });
      if (!profile) {
        throw new UnauthorizedException('Not authorized');
      }
      
      res.locals.profile = profile;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Not authorized');
    }
  }
}
