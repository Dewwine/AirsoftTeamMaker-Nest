import {
  Controller,
  Get,
  Put,
  Post,
  HttpException,
  Param,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { ProfileModel } from './profile.model';
import { ProfileService } from './profile.service';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SuspendService } from 'src/suspend/suspend.service';

@Controller()
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly suspendService: SuspendService,
  ) {}

  @Roles(3, 2, 1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(['/player', '/manager'])
  async getProfiles(@Req() req: Request) {
    const role: string = req.url.split('/')[2];
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    const profiles: ProfileModel[] =
      await this.profileService.getProfilesByRole(role);

    return profiles.map((profile) => profile.toResponse());
  }

  @Roles(2, 1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(['/player/:id', '/manager/:id'])
  async getProfile(@Param() params: { id: number }) {
    const id: number = params.id;

    if (!id) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const profile: ProfileModel | null =
      await this.profileService.getProfileById(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return profile.toResponse();
  }

  @Roles(3, 2, 1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('me')
  async GetMe(@Res({ passthrough: true }) res: Response) {
    const { id } = res.locals.profile;
    if (!id) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const profile: ProfileModel | null =
      await this.profileService.getProfileById(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return profile.toResponse();
  }

  @Roles(3, 2, 1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('me')
  async updateProfiles(
    @Res({ passthrough: true }) res: Response,
    @Body() body,
  ) {
    const { id } = res.locals.profile;
    if (!id) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    let profile: ProfileModel | null = await this.profileService.getProfileById(
      id,
    );

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    await this.profileService.updateProfileById(profile, body);

    profile = await this.profileService.getProfileById(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return profile.toResponse();
  }

  @Roles(3, 2, 1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          callback(null, './uploads/avatars');
        },
        filename: (_req, file, callback) => {
          callback(null, `${Date.now()}--${file.originalname}`);
        },
      }),
    }),
  )
  @Post('me')
  async updateAvatar(
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    const { id } = res.locals.profile;
    if (!id) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    let profile: ProfileModel | null = await this.profileService.getProfileById(
      id,
    );

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    await this.profileService.updateProfileAvatar(profile, file.path);

    profile = await this.profileService.getProfileById(id);

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'Avatar updated' };
  }

  @Roles(1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':role/:id/ban')
  async banProfile(
    @Param() params: { role: string; id: number },
    @Body() body: { suspendReason: string },
  ) {
    const { id } = params;
    if (!id) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const { suspendReason } = body;
    if (!suspendReason) {
      throw new HttpException('No reason', HttpStatus.BAD_REQUEST);
    }

    const profile: ProfileModel | null =
      await this.profileService.getProfileById(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    if (profile.roleId === 1) {
      throw new HttpException('Profile is admin', HttpStatus.BAD_REQUEST);
    }

    await this.suspendService.banProfileById(id, suspendReason);
    return { message: 'Profile banned' };
  }

  @Roles(1)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':role/:id/unban')
  async unbanProfile(
    @Param() params: { role: string; id: number },
    @Body() body: { suspendReason: string },
  ) {
    const { id } = params;
    if (!id) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const { suspendReason } = body;
    if (!suspendReason) {
      throw new HttpException('No reason', HttpStatus.BAD_REQUEST);
    }

    const profile: ProfileModel | null =
      await this.profileService.getProfileById(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    if (profile.roleId === 1) {
      throw new HttpException('Profile is admin', HttpStatus.BAD_REQUEST);
    }

    await this.suspendService.unbanProfileById(id, suspendReason);
    return { message: 'Profile unbanned' };
  }
}
