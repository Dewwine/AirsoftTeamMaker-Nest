import { Injectable } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { RegisterProfileDto } from './dto/register-profile.dto';
import * as bcrypt from 'bcryptjs';
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private profileService: ProfileService,
  ) // private jwtService: JwtService,
  {}

  register = async (dto: RegisterProfileDto) => {
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(dto.password, salt);

    const profileDto = {
      email: dto.email,
      login: dto.login,
      password: hashedPassword,
      roleId: 1,
    };

    return await this.profileService.createProfile(profileDto);
  };
}
