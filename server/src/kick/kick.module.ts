import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from 'src/profile/profile.model';
import { KickModel } from './kick.model';
import { KickService } from './kick.service';

@Module({
  imports: [SequelizeModule.forFeature([KickModel, ProfileModel])],
  providers: [KickService],
  exports: [KickService],
})
export class KickModule {}
