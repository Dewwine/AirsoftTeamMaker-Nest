import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ProfileModel } from 'src/profile/profile.model';

interface IManagerRequestCreation {
  profileId: number;
  status: string;
}

@Table({ tableName: 'managerRequests' })
export class ManagerRequestModel extends Model<ManagerRequestModel, IManagerRequestCreation> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  status: string;

  @BelongsTo(() => ProfileModel)
  profile: ProfileModel;
  @ForeignKey(() => ProfileModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  profileId: number;
}
