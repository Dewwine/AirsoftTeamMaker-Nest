import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { TeamModule } from './team/team.module';
import { PlayerModule } from './player/player.module';
import { ManagerModule } from './manager/manager.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ProfileModel } from './profile/profile.model';
import { RolesModule } from './role/role.module';
import { RoleModel } from './role/role.model';
import { TeamModel } from './team/team.model';
import { KickModule } from './kick/kick.module';
import { SuspendModule } from './suspend/suspend.module';
import { KickModel } from './kick/kick.model';
import { SuspendModel } from './suspend/suspend.model';
import { ManagerRequestModel } from './manager/managerRequest.model';
import { TeamRequestModel } from './team/teamRequest.model';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './logger/logger.module';
import { ErrorLoggerModule } from './error-logger/error-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.zmkox.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`,
    ),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_NAME || 'profiles',
      models: [
        ProfileModel,
        RoleModel,
        TeamModel,
        KickModel,
        SuspendModel,
        ManagerRequestModel,
        TeamRequestModel,
      ],
      autoLoadModels: true,
      sync: { force: true },
    }),
    AuthModule,
    ProfileModule,
    TeamModule,
    PlayerModule,
    ManagerModule,
    RolesModule,
    KickModule,
    SuspendModule,
    LoggerModule,
    ErrorLoggerModule,
  ],
})
export class AppModule {}
