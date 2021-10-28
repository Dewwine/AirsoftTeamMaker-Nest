import { Controller, Get, Put, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  getMe(): string {
    return this.profileService.getMe();
  }

  @Put('me')
  updateProfile(): string {
    return this.profileService.updateProfile();
  }

  @Post('me')
  updateAvatar(): string {
    return this.profileService.updateAvatar();
  }
}
