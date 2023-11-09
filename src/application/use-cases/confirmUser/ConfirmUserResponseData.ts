import { User } from '../../../domain/entities/User';

export class ConfirmUserResponseData {
  constructor(
    public user: User,
    public confirmed: boolean,
  ) {}
}
