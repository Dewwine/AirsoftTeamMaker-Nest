import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileModel } from 'src/profile/profile.model';
import { KickModel } from './kick.model';

@Injectable()
export class KickService {
  constructor(
    @InjectModel(KickModel)
    private kickRepository: typeof KickModel,
    @InjectModel(ProfileModel)
    private profileRepository: typeof ProfileModel,
  ) {}

  async getKickTable(id: number): Promise<KickModel> {
    return await this.kickRepository.findOne({
      where: {
        profileId: id,
      },
    });
  }

  async createKickTable(body: ProfileModel): Promise<KickModel> {
    return await this.kickRepository.create({
      profileId: body.id,
      isActive: body.teamId !== null ? false : true,
      kickReason: null,
    });
  }

  async kickTeamById(id: number, reason: string) {
    await this.profileRepository.update(
      {
        teamId: null,
      },
      {
        where: {
          id: id,
        },
      },
    );

    await this.kickRepository.update(
      {
        isActive: false,
        kickReason: reason,
      },
      {
        where: {
          profileId: id,
        },
      },
    );
  }
}
