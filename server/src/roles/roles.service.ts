import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesModel } from './roles.model';

@Injectable()
export class RolesService implements OnModuleInit {

  constructor(@InjectModel(RolesModel) private rolesRepository: typeof RolesModel) {}

  onModuleInit() {
    this.rolesRepository.create({
      id: 1,
      name: 'admin',
    });
    this.rolesRepository.create({
      id: 2,
      name: 'manager',
    });
    this.rolesRepository.create({
      id: 3,
      name: 'player',
    });
  }
}
