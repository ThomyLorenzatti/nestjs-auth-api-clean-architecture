import { IUserRepository } from '../../interfaces/repositories/IUserRepository';
import { IMailService } from '../../interfaces/services/IMailService';
import { IJWTokenService } from '../../interfaces/services/IJWTokenService';
import { IForgotPasswordMailBuilder } from '../../interfaces/builders/IForgotPasswordMailBuilder';
import { ForgotPasswordMailBuilder } from '../builders/buildForgotPasswordMail/buildForgotPasswordMail';
import { Response } from '../../common/Response';
import { Inject } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ForgotPasswordDTO } from './forgotPasswordDTO';

dotenv.config();

export class ForgotPasswordUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IJWTokenService') private readonly jwTokenService: IJWTokenService,
    @Inject('IMailService') private readonly mailService: IMailService,
  ) {}

  async execute(dto: ForgotPasswordDTO): Promise<Response<void>> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      return new Response<void>(
        null,
        'No account found with this email address.',
        false,
      );
    }

    const token = await this.jwTokenService.generateToken(user.id);

    const resetLink = `${process.env.MOBILE_APP_SCHEME}://reset-password/${user.id}/${token}`;

    const resetData: IForgotPasswordMailBuilder = {
      username: user.name,
      resetLink: resetLink,
    };

    const confirmMail = new ForgotPasswordMailBuilder().build(
      `"${dotenv.config().parsed.SMTP_FROM_NAME}" <${
        dotenv.config().parsed.SMTP_FROM_EMAIL
      }>`,
      user.email,
      resetData,
    );

    await this.mailService.sendMail(confirmMail);

    return new Response<void>(null, 'Password reset email sent!', true);
  }
}
