import {
  Column,
  Table,
  DataType,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { RolesModel } from '../roles/roles.model';
import { TeamModel } from '../team/team.model';

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

  @BelongsTo(() => RolesModel)
  role: RolesModel;
  @ForeignKey(() => RolesModel)
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
    allowNull: false,
  })
  teamId: number;
}
