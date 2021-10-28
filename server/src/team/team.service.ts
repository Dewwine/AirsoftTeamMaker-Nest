import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TeamModel } from './team.model';

@Injectable()
export class TeamService implements OnModuleInit {

  constructor(@InjectModel(TeamModel) private teamRepository: typeof TeamModel) {}

  onModuleInit() {
    this.teamRepository.create({
      id: 1,
      name: 'teamA',
    });
    this.teamRepository.create({
      id: 2,
      name: 'teamB',
    });
  }
}
