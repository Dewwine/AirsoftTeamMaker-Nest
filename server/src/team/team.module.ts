import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileModel } from 'src/profile/profile.model';
import { ProfileModule } from 'src/profile/profile.module';
import { TeamController } from './team.controller';
import { TeamModel } from './team.model';
import { TeamService } from './team.service';
import { TeamRequestModel } from './teamRequest.model';

@Module({
  imports: [
    SequelizeModule.forFeature([TeamModel, TeamRequestModel, ProfileModel]),
    AuthModule,
    ProfileModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
