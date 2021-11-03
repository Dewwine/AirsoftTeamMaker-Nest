import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileModule } from 'src/profile/profile.module';
import { TeamModule } from 'src/team/team.module';
import { KickModule } from 'src/kick/kick.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { KickModel } from 'src/kick/kick.model';
import { ProfileModel } from 'src/profile/profile.model';
import { TeamRequestModel } from 'src/team/teamRequest.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProfileModel,
      KickModel,
      TeamRequestModel,
    ]),
    AuthModule,
    ProfileModule,
    TeamModule,
    KickModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
