import { IUserRepository } from '../../interfaces/repositories/IUserRepository';
import { IPasswordHasher } from '../../interfaces/services/IPasswordHasher';
import { IJWTokenService } from '../../interfaces/services/IJWTokenService';
import { LoginDTO } from './loginDTO';
import { loginResponseData } from './loginResponseData';
import { Response } from '../../common/Response';
import { Inject } from '@nestjs/common';

export class LoginUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @Inject('IJWTokenService') private readonly jwTokenService: IJWTokenService,
  ) {}

  async execute(dto: LoginDTO): Promise<Response<loginResponseData>> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      return new Response<loginResponseData>(null, 'User not found.', false);
    }

    const isValidPassword = await this.passwordHasher.compare(
      dto.password,
      user.password,
    );

    if (!isValidPassword) {
      return new Response<loginResponseData>(null, 'Invalid password.', false);
    }

    const token = await this.jwTokenService.generateToken(user.id);

    return new Response<loginResponseData>(
      new loginResponseData(user, token),
      'Login successful.',
      true,
    );
  }
}
