import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileModel } from 'src/profile/profile.model';
import { ProfileService } from 'src/profile/profile.service';
import { Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { ManagerService } from './manager.service';
import { ManagerRequestModel } from './managerRequest.model';

@Controller()
export class ManagerController {
  constructor(
    private readonly managerService: ManagerService,
    private readonly profileService: ProfileService,
  ) {}

  @Roles(1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/managerRequests')
  async getTeamRequests() {
    const managerApplications: ManagerRequestModel[] =
      await this.managerService.getManagerRequests();
    if (!managerApplications) {
      throw new HttpException('Applications not found', HttpStatus.NOT_FOUND);
    }

    return managerApplications;
  }

  @Roles(1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('manager/:id/approve')
  async approveManager(@Param() params: { id: number }) {
    const { id } = params;
    if (!id) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const profile: ProfileModel | null =
      await this.profileService.getProfileById(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const managerRequest =
      await this.managerService.getManagerRequestByProfileId(id);
    if (!managerRequest) {
      throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
    }

    await this.managerService.approveManagerById(id);
    return { message: 'Application approved' };
  }

  @Roles(1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('manager/:id/decline')
  async declineManager(@Param() params: { id: number }) {
    const { id } = params;
    if (!id) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const profile: ProfileModel | null =
      await this.profileService.getProfileById(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const managerRequest =
      await this.managerService.getManagerRequestByProfileId(id);
    if (!managerRequest) {
      throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
    }

    await this.managerService.declineManagerById(id);
    return { message: 'Application declined' };
  }
}
