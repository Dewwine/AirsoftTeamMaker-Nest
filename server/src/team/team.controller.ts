import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileModel } from 'src/profile/profile.model';
import { ProfileService } from 'src/profile/profile.service';
import { Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { TeamService } from './team.service';
import { Response } from 'express';
import { TeamRequestModel } from './teamRequest.model';
import { TeamModel } from './team.model';

@Controller()
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly profileService: ProfileService,
  ) {}

  @Roles(3)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/myteam')
  async getMyTeam(@Res({ passthrough: true }) res: Response) {
    const { id } = res.locals.profile;

    const me: ProfileModel = await this.profileService.getProfileById(id);
    if (!me.teamId) {
      throw new HttpException(
        'You are not on any team',
        HttpStatus.BAD_REQUEST,
      );
    }

    const profiles: ProfileModel[] =
      await this.profileService.getProfilesByTeam(me.teamId);

    return profiles.map((profile) => profile.toResponse());
  }

  @Roles(2)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/teamRequests')
  async getTeamRequests() {
    const teamApplications: TeamRequestModel[] =
      await this.teamService.getTeamRequests();
    if (!teamApplications) {
      throw new HttpException('Applications not found', HttpStatus.NOT_FOUND);
    }

    return teamApplications;
  }

  @Roles(3, 2, 1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('teams/:team')
  async getTeam(@Param() params) {
    const { team: teamName } = params;

    if (!teamName) {
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }

    const team = await this.teamService.getTeamByName(teamName);
    if (!team) {
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }

    const profiles: ProfileModel[] =
      await this.profileService.getProfilesByTeam(team.id);

    return profiles.map((profile) => profile.toResponse());
  }

  @Roles(3)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('teams/:team/apply')
  async applyTeam(
    @Res({ passthrough: true }) res: Response,
    @Param() params: { team: string },
  ) {
    const { id, teamId: playerTeam } = res.locals.profile;

    const { team: teamName } = params;
    if (!teamName) {
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }

    const team = await this.teamService.getTeamByName(teamName);
    if (!team) {
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }

    if (!['teamA', 'teamB'].includes(team.name)) {
      throw new HttpException('Team not exists', HttpStatus.NOT_FOUND);
    }
    if (playerTeam === team.id) {
      throw new HttpException('Already in team', HttpStatus.BAD_REQUEST);
    }

    const playersInTeam: ProfileModel[] =
      await this.profileService.getProfilesByTeam(team.id);
    if (playersInTeam.length === 10) {
      throw new HttpException('Team is full', HttpStatus.BAD_REQUEST);
    }

    const teamRequest: TeamRequestModel | null =
      await this.teamService.getTeamRequestByProfileId(id);
    if (teamRequest) {
      throw new HttpException(
        'You already have active request',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.teamService.requestTeamById(team.id, id);

    return { message: 'Application sent' };
  }

  @Roles(3)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('teams/:team/cancel')
  async cancelTeam(
    @Res({ passthrough: true }) res: Response,
    @Param() params: { team: string },
  ) {
    const { id } = res.locals.profile;
    const { team: teamName } = params;

    const teamRequest: TeamRequestModel | null =
      await this.teamService.getTeamRequestByProfileId(id);
    if (!teamRequest) {
      throw new HttpException(
        'Your application was reviewed by manager',
        HttpStatus.BAD_REQUEST,
      );
    }

    const team: TeamModel = await this.teamService.getTeamByName(teamName);

    if (teamRequest.teamRequest !== team.id) {
      throw new HttpException(
        'Your have not application for this team',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.teamService.cancelTeam(teamRequest);

    return { message: 'Application cancelled' };
  }

  @Roles(3)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('teams/:team/leave')
  async leaveTeam(
    @Res({ passthrough: true }) res: Response,
    @Param() params: { team: string },
  ) {
    const { id, teamId } = res.locals.profile;
    const { team: teamName } = params;

    if (!teamId) {
      throw new HttpException(
        'You are not on any team',
        HttpStatus.BAD_REQUEST,
      );
    }

    const team = await this.teamService.getTeamByName(teamName);

    if (team.id !== teamId) {
      throw new HttpException(
        'You are not in this team',
        HttpStatus.BAD_REQUEST,
      );
    }

    const teamRequest: TeamRequestModel | null =
      await this.teamService.getTeamRequestByProfileId(id);
    if (teamRequest) {
      throw new HttpException(
        'You already have active request',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.teamService.leaveTeamById(id);

    return { message: 'Application sent' };
  }
}
