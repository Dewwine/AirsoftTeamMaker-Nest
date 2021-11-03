import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileModule } from 'src/profile/profile.module';
import { SuspendModel } from 'src/suspend/suspend.model';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { ManagerRequestModel } from './managerRequest.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ManagerRequestModel, SuspendModel]),
    forwardRef(() => ProfileModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}
