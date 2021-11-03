import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleModel } from 'src/role/role.model';
import { TeamModel } from 'src/team/team.model';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileModel } from './profile.model';
import Sequelize from 'sequelize';
import hashPassword from 'src/utils/hashPassword';

const Op = Sequelize.Op;

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileModel)
    private profileRepository: typeof ProfileModel,
  ) {}

  async createProfile(dto: CreateProfileDto) {
    return await this.profileRepository.create(dto);
  }

  async getProfilesByRole(role: string): Promise<ProfileModel[] | null> {
    return await this.profileRepository.findAll({
      include: [
        { model: RoleModel, where: { name: role } },
        { model: TeamModel },
      ],
    });
  }

  async getProfilesByTeam(teamId: number): Promise<ProfileModel[] | null> {
    return await this.profileRepository.findAll({
      include: [
        { model: RoleModel },
        { model: TeamModel, where: { id: teamId } },
      ],
    });
  }

  async getProfileById(id: number): Promise<ProfileModel | null> {
    return await this.profileRepository.findByPk(id, {
      include: [{ model: RoleModel }, { model: TeamModel }],
    });
  }

  async getProfileByLogin(login: string): Promise<ProfileModel | null> {
    return await this.profileRepository.findOne({ where: { login: login } });
  }

  async getProfileByEmail(email: string) {
    return await this.profileRepository.findOne({ where: { email: email } });
  }

  async getProfileByResetToken(resetPasswordToken: string) {
    return await ProfileModel.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpire: {
          [Op.gt]: Date.now(),
        },
      },
    });
  }

  async updateProfileById(profile: ProfileModel, body: CreateProfileDto) {
    if (body.login) {
      profile.login = body.login;
    }
    if (body.password) {
      profile.password = await hashPassword(body.password);
    }

    await profile.save();
  }

  async updateProfileAvatar(profile: ProfileModel, filepath: string) {
    if (filepath) {
      profile.avatar = filepath;
    }

    await profile.save();
  }
}
