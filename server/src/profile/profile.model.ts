import {
  Column,
  Table,
  DataType,
  Model,
  BelongsTo,
  HasOne,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { KickModel } from 'src/kick/kick.model';
import { ManagerRequestModel } from 'src/manager/managerRequest.model';
import { SuspendModel } from 'src/suspend/suspend.model';
import { TeamRequestModel } from 'src/team/teamRequest.model';
import { RoleModel } from '../role/role.model';
import { TeamModel } from '../team/team.model';

interface IProfileResponse {
  id: number;
  login: string;
  avatar: string;
  roleId: number;
  teamId: number;
}

interface IProfileCreationAttrs {
  email: string;
  login: string;
  password: string;
  roleId: number;
}

@Table({ tableName: 'profiles' })
export class ProfileModel extends Model<ProfileModel, IProfileCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  login: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
  })
  resetPasswordToken: string;

  @Column({
    type: DataType.DATE,
  })
  resetPasswordExpire: Date;

  @Column({
    type: DataType.STRING,
    defaultValue:
      'uploads/avatars/1635170908486--png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png',
  })
  avatar: string;

  @BelongsTo(() => RoleModel)
  role: RoleModel;
  @ForeignKey(() => RoleModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId: number;

  @BelongsTo(() => TeamModel)
  team: TeamModel;
  @ForeignKey(() => TeamModel)
  @Column({
    type: DataType.INTEGER,
  })
  teamId: number;

  @HasOne(() => KickModel)
  kick: KickModel;

  @HasOne(() => SuspendModel)
  suspend: SuspendModel;

  @HasOne(() => ManagerRequestModel)
  managerRequest: ManagerRequestModel;

  @HasMany(() => TeamRequestModel)
  teamRequests: TeamRequestModel[];


  toResponse() {
    const { id, login, roleId, avatar, teamId } = this;
    return { id, login, roleId, avatar, teamId };
  }
}
