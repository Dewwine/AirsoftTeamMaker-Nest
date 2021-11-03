import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from 'src/profile/profile.model';
import { SuspendModel } from './suspend.model';
import { SuspendService } from './suspend.service';

@Module({
  imports: [SequelizeModule.forFeature([SuspendModel, ProfileModel])],
  providers: [SuspendService],
  exports: [SuspendService],
})
export class SuspendModule {}
