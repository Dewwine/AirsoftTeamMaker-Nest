import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { KickModel } from 'src/kick/kick.model';
import { ProfileModel } from 'src/profile/profile.model';
import { TeamRequestModel } from 'src/team/teamRequest.model';
@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(ProfileModel)
    private profileRepository: typeof ProfileModel,
    @InjectModel(TeamRequestModel)
    private teamRequestRepository: typeof TeamRequestModel,
    @InjectModel(KickModel)
    private kickRepository: typeof KickModel,
  ) {}

  async approveTeamById(teamId: number, id: number) {
    await this.profileRepository.update(
      {
        teamId: teamId,
      },
      {
        where: {
          id: id,
        },
      },
    );

    await this.teamRequestRepository.update(
      {
        status: 'approved',
      },
      {
        where: {
          profileId: id,
          status: 'waiting',
        },
      },
    );

    await this.kickRepository.update(
      {
        isActive: true,
        kickReason: null,
      },
      {
        where: {
          profileId: id,
        },
      },
    );
  }

  async declineTeamById(id: number) {
    await this.teamRequestRepository.update(
      {
        status: 'declined',
      },
      {
        where: {
          profileId: id,
          status: 'waiting',
        },
      },
    );
  }
}
