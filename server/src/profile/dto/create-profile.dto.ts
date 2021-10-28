export class CreateProfileDto {
  readonly email: string;
  readonly login: string;
  readonly password: string;
  readonly roleId: number;
}