import { IUserRepository } from '../../interfaces/repositories/IUserRepository';
import { IJWTokenService } from '../../interfaces/services/IJWTokenService';
import { IPasswordHasher } from '../../interfaces/services/IPasswordHasher';
import { Response } from '../../common/Response';
import { Inject } from '@nestjs/common';
import { ResetPasswordDTO } from './resetPasswordDTO';
import { User } from '../../../domain/entities/User';

export class ResetPasswordUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IJWTokenService') private readonly jwTokenService: IJWTokenService,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<Response<void>> {
    const payload = await this.jwTokenService.validateToken(dto.token);

    if (!payload) {
      return new Response<void>(null, 'Invalid or expired reset token.', false);
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      return new Response<void>(null, 'User not found.', false);
    }

    const hashedPassword = await this.passwordHasher.hash(dto.newPassword);

    await this.userRepository.update(
      new User(
        user.name,
        user.email,
        hashedPassword,
        user.dateOfBirth,
        user.id,
        user.emailVerified,
      ),
    );

    return new Response<void>(
      null,
      'Password has been reset successfully.',
      true,
    );
  }
}
