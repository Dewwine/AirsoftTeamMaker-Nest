import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileModel } from './profile.model';

@Injectable()
export class ProfileService {

  constructor(@InjectModel(ProfileModel) private profileRepository: typeof ProfileModel) {}

  createProfile(dto: CreateProfileDto) {
    return this.profileRepository.create(dto);
  }

  getMe(): string {
    return 'me';
  }

  updateProfile(): string {
    return 'updateProfile';
  }

  updateAvatar(): string {
    return 'updateAvatar';
  }
}
