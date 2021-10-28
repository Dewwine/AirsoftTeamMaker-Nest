import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { TeamModule } from './team/team.module';
import { PlayerModule } from './player/player.module';
import { ManagerModule } from './manager/manager.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ProfileModel } from './profile/profile.model';
import { RolesModule } from './roles/roles.module';
import { RolesModel } from './roles/roles.model';
import { TeamModel } from './team/team.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_NAME || 'profiles',
      models: [ProfileModel, RolesModel, TeamModel],
      autoLoadModels: true,
      sync: { force: true },
    }),
    AuthModule,
    ProfileModule,
    TeamModule,
    PlayerModule,
    ManagerModule,
    RolesModule,
  ],
})
export class AppModule {}
