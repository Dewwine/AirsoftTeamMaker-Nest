import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModel } from 'src/roles/roles.model';
import { TeamModel } from 'src/team/team.model';
import { ProfileController } from './profile.controller';
import { ProfileModel } from './profile.model';
import { ProfileService } from './profile.service';

@Module({
  imports: [SequelizeModule.forFeature([ProfileModel, RolesModel, TeamModel])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
