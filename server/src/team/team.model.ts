import { Column, Table, DataType, Model, HasMany } from 'sequelize-typescript';
import { ProfileModel } from '../profile/profile.model';

interface ITeam {
  id: number;
  name: string;
}

@Table({ tableName: 'teams', timestamps: false })
export class TeamModel extends Model<TeamModel, ITeam> {
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
