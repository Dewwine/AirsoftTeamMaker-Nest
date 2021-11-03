import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ProfileModel } from 'src/profile/profile.model';
import { TeamModel } from './team.model';

interface ITeamRequest {
  profileId: number;
  teamRequest: number;
  status: string;
}

@Table({ tableName: 'teamRequests' })
export class TeamRequestModel extends Model<TeamRequestModel, ITeamRequest> {
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

  @BelongsTo(() => TeamModel)
  team: TeamModel;
  @ForeignKey(() => TeamModel)
  @Column({
    type: DataType.INTEGER,
  })
  teamRequest: number;
}
