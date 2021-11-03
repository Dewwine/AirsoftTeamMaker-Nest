import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { KickModel } from 'src/kick/kick.model';
import { ManagerRequestModel } from 'src/manager/managerRequest.model';
import { RoleModel } from 'src/role/role.model';
import { SuspendModel } from 'src/suspend/suspend.model';
import { SuspendModule } from 'src/suspend/suspend.module';
import { TeamModel } from 'src/team/team.model';
import { TeamRequestModel } from 'src/team/teamRequest.model';
import { ProfileController } from './profile.controller';
import { ProfileModel } from './profile.model';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProfileModel,
      RoleModel,
      TeamModel,
      KickModel,
      SuspendModel,
      ManagerRequestModel,
      TeamRequestModel,
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    forwardRef(() => AuthModule),
    SuspendModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
