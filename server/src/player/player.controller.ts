import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { KickService } from 'src/kick/kick.service';
import { ProfileModel } from 'src/profile/profile.model';
import { ProfileService } from 'src/profile/profile.service';
import { Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { TeamService } from 'src/team/team.service';
import { TeamRequestModel } from 'src/team/teamRequest.model';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly profileService: ProfileService,
    private readonly teamService: TeamService,
    private readonly kickService: KickService,
  ) {}

  @Roles(2)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id/approve')
  async approveTeam(@Param() params: { id: number }) {
    const { id } = params;
    if (!id) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const profile: ProfileModel | null =
      await this.profileService.getProfileById(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const teamApplication: TeamRequestModel | null =
      await this.teamService.getTeamRequestByProfileId(id);
    if (!teamApplication) {
      throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
    }

    const { teamRequest } = teamApplication;

    const kickTable = await this.kickService.getKickTable(id);
    if (!kickTable) {
      await this.kickService.createKickTable(profile);
    }

    await this.playerService.approveTeamById(teamRequest, id);

    return { message: 'Application approved' };
  }

  @Roles(2)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id/decline')
  async declineTeam(@Param() params: { id: number }) {
    const { id } = params;
    if (!id) {
      throw new HttpException('Profile not found', 404);
    }

    const profile: ProfileModel | null =
      await this.profileService.getProfileById(id);
    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }

    const teamApplication: TeamRequestModel | null =
      await this.teamService.getTeamRequestByProfileId(id);
    if (!teamApplication) {
      throw new HttpException('Application not found', 404);
    }

    await this.playerService.declineTeamById(id);

    return { message: 'Application declined' };
  }

  @Roles(2, 1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id/kick')
  async kickTeam(
    @Param() params: { id: number },
    @Body() body: { kickReason: string },
  ) {
    const { id } = params;
    if (!id) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const { kickReason } = body;
    if (!kickReason) {
      throw new HttpException('No reason', HttpStatus.BAD_REQUEST);
    }

    const profile: ProfileModel | null =
      await this.profileService.getProfileById(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const { teamId } = profile;
    if (!teamId) {
      throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
    }

    await this.kickService.kickTeamById(id, kickReason);
    return { message: 'Player kicked' };
  }
}
