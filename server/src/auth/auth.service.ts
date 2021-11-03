import { Injectable } from '@nestjs/common';
import { RegisterProfileDto } from './dto/register-profile.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { RoleModel } from 'src/role/role.model';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileService } from 'src/profile/profile.service';
import { JwtService } from '@nestjs/jwt';
import { LoginProfileDto } from './dto/login-profile.dto';
import { ProfileModel } from 'src/profile/profile.model';
import hashPassword from 'src/utils/hashPassword';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RoleModel) private roleRepository: typeof RoleModel,
    @InjectModel(ProfileModel) private profileRepository: typeof ProfileModel,
    private profileService: ProfileService,
    private jwtService: JwtService,
  ) {}

  async generateToken(profile: ProfileModel) {
    const payload = {
      id: profile.id,
      login: profile.login,
      roleId: profile.roleId,
      time: profile.createdAt,
    };
    return this.jwtService.sign(payload);
  }

  async validateLogin(ProfileDto: LoginProfileDto) {
    const profile = await this.profileService.getProfileByLogin(
      ProfileDto.login,
    );
    return await bcrypt.compare(ProfileDto.password, profile.password);
  }

  async register(dto: RegisterProfileDto) {
    const hashedPassword: string = await hashPassword(dto.password);

    const role = await this.roleRepository.findOne({
      where: { name: dto.role },
    });

    const profileDto = {
      email: dto.email,
      login: dto.login,
      password: hashedPassword,
      roleId: role.get().id,
    };

    return await this.profileService.createProfile(profileDto);
  }

  async generateResetToken(resetToken: string) {
    return crypto.createHash('sha256').update(resetToken).digest('hex');
  }

  async createResetPasswordToken(id: number) {
    const resetToken: string = crypto.randomBytes(20).toString('hex');

    await this.profileRepository.update(
      {
        resetPasswordToken: await this.generateResetToken(resetToken),
        resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000),
      },
      {
        where: {
          id: id,
        },
      },
    );

    return resetToken;
  }

  async deleteResetPasswordToken(id: number) {
    await this.profileRepository.update(
      {
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
      {
        where: {
          id: id,
        },
      },
    );
  }

  async createNewPassword(id: number, newPassword: string) {
    const hashedPassword: string = await hashPassword(newPassword);

    await this.profileRepository.update(
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
      {
        where: {
          id: id,
        },
      },
    );
  }
}
