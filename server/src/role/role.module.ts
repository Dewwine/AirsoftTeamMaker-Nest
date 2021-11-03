import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from 'src/profile/profile.model';
import { RoleModel } from './role.model';
import { RolesService } from './role.service';

@Module({
  imports: [SequelizeModule.forFeature([RoleModel, ProfileModel])],
  providers: [RolesService],
})
export class RolesModule {}
