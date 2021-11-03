import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProfileModel } from 'src/profile/profile.model';
import { ManagerService } from 'src/manager/manager.service';
import { ProfileService } from 'src/profile/profile.service';
import { SuspendService } from 'src/suspend/suspend.service';
import { AuthService } from './auth.service';
import { RegisterProfileDto } from './dto/register-profile.dto';
import { LoginProfileDto } from './dto/login-profile.dto';
import { ManagerRequestModel } from 'src/manager/managerRequest.model';
import { SuspendModel } from 'src/suspend/suspend.model';
import { sendEmail } from '../utils/emailSender';

@Controller('')
export class AuthController {
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private suspendService: SuspendService,
    private managerService: ManagerService,
  ) {}

  @Post('/register')
  async register(@Body() dto: RegisterProfileDto) {
    if (!dto.email) {
      throw new HttpException('No email', HttpStatus.BAD_REQUEST);
    }
    if (!dto.login) {
      throw new HttpException('No login', HttpStatus.BAD_REQUEST);
    }
    if (!dto.password) {
      throw new HttpException('No password', HttpStatus.BAD_REQUEST);
    }
    if (!dto.role) {
      throw new HttpException('No role', HttpStatus.BAD_REQUEST);
    }

    const checkProfile: ProfileModel | null =
      await this.profileService.getProfileByLogin(dto.login);
    if (checkProfile) {
      throw new HttpException('Profile already exists', HttpStatus.BAD_REQUEST);
    }

    const profile: ProfileModel = await this.authService.register(dto);

    await this.suspendService.createSuspendTable(profile);

    if (profile.roleId === 2) {
      await this.managerService.requestRegisterById(profile.id);
      throw new HttpException('Your application was sent', HttpStatus.ACCEPTED);
    }

    const token: string = await this.authService.generateToken(profile);

    return { message: 'Success', token };
  }

  @Post('/login')
  async login(@Body() ProfileDto: LoginProfileDto) {
    if (!ProfileDto.login) {
      throw new HttpException('No login', HttpStatus.BAD_REQUEST);
    }
    if (!ProfileDto.password) {
      throw new HttpException('No password', HttpStatus.BAD_REQUEST);
    }

    const profile: ProfileModel | null =
      await this.profileService.getProfileByLogin(ProfileDto.login);
    if (!profile) {
      throw new HttpException('Invalid login', HttpStatus.UNAUTHORIZED);
    }

    const isMatch: boolean = await this.authService.validateLogin(ProfileDto);
    if (!isMatch) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const managerRequest: ManagerRequestModel | null =
      await this.managerService.getManagerRequestByProfileId(profile.id);
    if (profile.roleId === 2 && managerRequest) {
      throw new HttpException(
        'Your application on review',
        HttpStatus.FORBIDDEN,
      );
    }

    const activeProfile: SuspendModel | null =
      await this.suspendService.checkActiveProfile(profile.id);
    if (!activeProfile) {
      throw new HttpException('Something went wrong', HttpStatus.FORBIDDEN);
    }

    if (profile.roleId === 2 && !activeProfile.isActive) {
      throw new HttpException(
        'Your application was declined',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!activeProfile.isActive) {
      throw new HttpException(
        'Your account is suspended',
        HttpStatus.FORBIDDEN,
      );
    }

    const token: string = await this.authService.generateToken(profile);

    return { message: 'Success', token };
  }

  @Get('/logout')
  async logout() {}

  @Post('/forgotpassword')
  async forgotPassword(@Body() body: { email: string }) {
    const profile: ProfileModel | null =
      await this.profileService.getProfileByEmail(body.email);
    if (!profile) {
      throw new HttpException('No user with such email', HttpStatus.NOT_FOUND);
    }

    const resetToken: string = await this.authService.createResetPasswordToken(
      profile.id,
    );

    const resetMessage: string = `Your password reset url is: ${resetToken}`;

    try {
      await sendEmail({
        email: profile.email,
        subject: 'Password reset token',
        message: resetMessage,
      });
    } catch (err) {
      await this.authService.deleteResetPasswordToken(profile.id);

      throw new HttpException(
        'No user with such email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'Reset token was sent on your email' };
  }

  @Put('/resetpassword/:resettoken')
  async resetPassword(
    @Param() params: { resettoken: string },
    @Body() body: { password: string },
  ) {
      const resetPasswordToken: string = await this.authService.generateResetToken(params.resettoken);

    const profile: ProfileModel | null = await this.profileService.getProfileByResetToken(resetPasswordToken);
    if (!profile) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    await this.authService.createNewPassword(profile.id, body.password);

    return { message: 'Success' };
  }
}
