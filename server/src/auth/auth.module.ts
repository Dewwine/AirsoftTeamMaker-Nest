import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { ManagerModule } from 'src/manager/manager.module';
import { ProfileModel } from 'src/profile/profile.model';
import { ProfileModule } from 'src/profile/profile.module';
import { RoleModel } from 'src/role/role.model';
import { SuspendModule } from 'src/suspend/suspend.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    SequelizeModule.forFeature([RoleModel, ProfileModel]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET',
      signOptions: {
        expiresIn: 30 * 24 * 60 * 60,
      },
    }),
    forwardRef(() => ProfileModule),
    SuspendModule,
    ManagerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
