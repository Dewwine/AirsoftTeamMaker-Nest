import { Column, Table, DataType, Model, HasMany } from 'sequelize-typescript';
import { ProfileModel } from '../profile/profile.model';

interface IRole {
  id: number;
  name: string;
}

@Table({ tableName: 'roles', timestamps: false })
export class RolesModel extends Model<RolesModel, IRole> {
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
  name: string;

  @HasMany(() => ProfileModel)
  profiles: ProfileModel[];
}
