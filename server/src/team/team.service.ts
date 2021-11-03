import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TeamModel } from './team.model';
import { TeamRequestModel } from './teamRequest.model';

@Injectable()
export class TeamService implements OnModuleInit {
  constructor(
    @InjectModel(TeamRequestModel)
    private teamRequestRepository: typeof TeamRequestModel,
    @InjectModel(TeamModel)
    private teamRepository: typeof TeamModel,
  ) {}

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

  async getTeamByName(teamName: string): Promise<TeamModel | null> {
    return await this.teamRepository.findOne({ where: { name: teamName } });
  }

  async getTeamRequestByProfileId(id: number): Promise<TeamRequestModel | null> {
    return await this.teamRequestRepository.findOne({ where: { profileId: id, status: 'waiting' } });
  }

  async requestTeamById(teamId: number, id: number): Promise<void> {
    await this.teamRequestRepository.create({
      teamRequest: teamId,
      status: 'waiting',
      profileId: id,
    });
  }
  
  async cancelTeam(teamRequest: TeamRequestModel): Promise<void> {
    await teamRequest.destroy();
  }

  async leaveTeamById(id: number): Promise<void> {
    await this.teamRequestRepository.create({
      teamRequest: null,
      status: 'waiting',
      profileId: id,
    });
  }

  async getTeamRequests(): Promise<TeamRequestModel[]> {
    return await this.teamRequestRepository.findAll({ where: { status: 'waiting' } });
  }
}
