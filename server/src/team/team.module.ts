import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from 'src/profile/profile.model';
import { TeamController } from './team.controller';
import { TeamModel } from './team.model';
import { TeamService } from './team.service';

@Module({
  imports: [SequelizeModule.forFeature([TeamModel, ProfileModel])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
