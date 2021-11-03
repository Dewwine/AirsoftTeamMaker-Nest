import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileModel } from 'src/profile/profile.model';
import { SuspendModel } from './suspend.model';

@Injectable()
export class SuspendService {
  constructor(
    @InjectModel(SuspendModel)
    private suspendRepository: typeof SuspendModel,
  ) {}

  async createSuspendTable(body: ProfileModel): Promise<SuspendModel> {
    return await this.suspendRepository.create({
      profileId: body.id,
      isActive: body.roleId === 2 ? false : true,
    });
  }

  async checkActiveProfile(id: number): Promise<SuspendModel> {
    return await this.suspendRepository.findOne({
      where: {
        profileId: id,
      },
    });
  }

  async banProfileById(id: number, reason: string): Promise<void> {
    await this.suspendRepository.update(
      {
        isActive: false,
        suspendReason: reason,
      },
      {
        where: {
          profileId: id,
        },
      },
    );
  }

  async unbanProfileById(id: number, reason: string): Promise<void> {
    await SuspendModel.update(
      {
        isActive: true,
        suspendReason: reason,
      },
      {
        where: {
          profileId: id,
        },
      },
    );
  }
}
