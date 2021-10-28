import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from 'src/profile/profile.model';
import { RolesModel } from './roles.model';
import { RolesService } from './roles.service';

@Module({
  imports: [SequelizeModule.forFeature([RolesModel, ProfileModel])],
  providers: [RolesService],
})
export class RolesModule {}
