import { User } from '../../../domain/entities/User';

export class CreateUserResponseData {
  id: number;
  name: string;
  email: string;
  token?: string;

  constructor(user: User, token?: string) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.token = token;
  }
}
