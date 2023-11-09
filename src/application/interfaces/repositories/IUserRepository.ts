import { User } from '../../../domain/entities/User';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  save(user: User): Promise<User>;

  update(user: User): Promise<User>;

  remove(user: User): Promise<void>;
}
