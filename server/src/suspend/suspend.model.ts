import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ProfileModel } from 'src/profile/profile.model';

interface ISuspendCreation {
  profileId: number;
  isActive: boolean;
}

@Table({ tableName: 'suspendTable' })
export class SuspendModel extends Model<SuspendModel, ISuspendCreation> {
  @Column({
    type: DataType.BOOLEAN,
  })
  isActive: boolean;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  suspendReason: string;

  @BelongsTo(() => ProfileModel)
  profile: ProfileModel;
  @ForeignKey(() => ProfileModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  profileId: number;
}
