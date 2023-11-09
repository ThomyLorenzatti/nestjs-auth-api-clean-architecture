import { CreateUserDTO } from './createUserDTO';
import { IUserRepository } from '../../interfaces/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { IPasswordHasher } from '../../interfaces/services/IPasswordHasher';
import { CreateUserResponseData } from './createUserResponseData';
import { Response } from '../../common/Response';
import { Inject } from '@nestjs/common';
import { IJWTokenService } from '../../interfaces/services/IJWTokenService';
import { ConfirmationUserMailBuilder } from '../builders/buildUserConfirmationMail/buildUserConfirmationMail';
import * as dotenv from 'dotenv';
import { IConfirmationMailBuilder } from 'src/application/interfaces/builders/IConfirmationMailBuilder';
import { IMailService } from '../../interfaces/services/IMailService';

dotenv.config();

export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @Inject('IJWTokenService') private readonly jwTokenService: IJWTokenService,
    @Inject('IMailService') private readonly mailService: IMailService,
  ) {}

  async execute(
    data: CreateUserDTO,
  ): Promise<Response<CreateUserResponseData>> {
    const { email, password, name, dateOfBirth } = data;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      if (existingUser) {
        return new Response<CreateUserResponseData>(
          null,
          'User with this email already exists.',
          false,
        );
      }
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    let user = new User(name, email, hashedPassword, dateOfBirth);

    user = await this.userRepository.save(user);

    const token: string = await this.jwTokenService.generateToken(user.id);

    await this.sendConfirmationMail(user, token);

    return new Response<CreateUserResponseData>(
      new CreateUserResponseData(user, token),
      'User created successfully!',
      true,
    );
  }

  private async sendConfirmationMail(user: User, token: string) {
    const confirmData: IConfirmationMailBuilder = {
      username: user.name,
      activationLink: `${dotenv.config().parsed.APP_URL}/api/users/confirm/${
        user.id
      }/${token}`,
    };

    const confirmMail = new ConfirmationUserMailBuilder().build(
      `"${dotenv.config().parsed.SMTP_FROM_NAME}" <${
        dotenv.config().parsed.SMTP_FROM_EMAIL
      }>`,
      user.email,
      confirmData,
    );

    await this.mailService.sendMail(confirmMail);
  }
}
