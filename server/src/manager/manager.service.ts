import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SuspendModel } from 'src/suspend/suspend.model';
import { ManagerRequestModel } from './managerRequest.model';

@Injectable()
export class ManagerService {
  constructor(
    @InjectModel(ManagerRequestModel)
    private managerRequestRepository: typeof ManagerRequestModel,
    @InjectModel(SuspendModel)
    private suspendRepository: typeof SuspendModel,
  ) {}

  async getManagerRequests() {
    return await this.managerRequestRepository.findAll({
      where: { status: 'waiting' },
    });
  }

  async requestRegisterById(id: number) {
    await this.managerRequestRepository.create({
      status: 'waiting',
      profileId: id,
    });
  }

  async getManagerRequestByProfileId(id: number) {
    return await this.managerRequestRepository.findOne({
      where: {
        profileId: id,
      },
    });
  }

  async approveManagerById(id: number) {
    await this.suspendRepository.update(
      {
        isActive: true,
      },
      {
        where: {
          profileId: id,
        },
      },
    );

    await this.managerRequestRepository.update(
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
  }

  async declineManagerById(id: number) {
    await this.managerRequestRepository.update(
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
