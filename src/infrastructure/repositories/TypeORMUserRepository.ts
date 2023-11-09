import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserORMEntity } from '../orm/entities/UserORMEntity';
import { IUserRepository } from '../../application/interfaces/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TypeORMUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserORMEntity)
    private readonly repository: Repository<UserORMEntity>,
  ) {}

  async findById(id: number): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user
      ? new User(
          user.name,
          user.email,
          user.password,
          user.dateOfBirth,
          user.id,
          user.email_verified,
        )
      : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user
      ? new User(
          user.name,
          user.email,
          user.password,
          user.dateOfBirth,
          user.id,
          user.email_verified,
        )
      : null;
  }

  async save(user: User): Promise<User> {
    const userEntity = this.repository.create({
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      password: user.password,
      email_verified: user.emailVerified,
    });
    const savedUser = await this.repository.save(userEntity);

    return new User(
      savedUser.name,
      savedUser.email,
      savedUser.password,
      savedUser.dateOfBirth,
      savedUser.id,
      savedUser.email_verified,
    );
  }

  async update(user: User): Promise<User> {
    const userEntity = await this.repository.findOne({
      where: { id: user.id },
    });

    if (!userEntity) {
      throw new Error('User not found.');
    }

    userEntity.name = user.name;
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.dateOfBirth = user.dateOfBirth;
    userEntity.email_verified = user.emailVerified;

    const updatedUserEntity = await this.repository.save(userEntity);

    return new User(
      updatedUserEntity.name,
      updatedUserEntity.email,
      updatedUserEntity.password,
      updatedUserEntity.dateOfBirth,
      updatedUserEntity.id,
      updatedUserEntity.email_verified,
    );
  }

  async remove(user: User): Promise<void> {
    const userEntity = await this.repository.findOne({
      where: { email: user.email },
    });
    if (userEntity) {
      await this.repository.remove(userEntity);
    }
  }
}
