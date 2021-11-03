import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ProfileModel } from 'src/profile/profile.model';

interface IKickCreation {
  profileId: number;
  isActive: boolean;
  kickReason: string;
}

@Table({ tableName: 'kickTable' })
export class KickModel extends Model<KickModel, IKickCreation> {
  @Column({
    type: DataType.BOOLEAN,
  })
  isActive: boolean;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  kickReason: string;

  @BelongsTo(() => ProfileModel)
  profile: ProfileModel;
  @ForeignKey(() => ProfileModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  profileId: number;
}
