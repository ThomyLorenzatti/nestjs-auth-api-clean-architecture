import { IUserRepository } from '../../interfaces/repositories/IUserRepository';
import { IJWTokenService } from '../../interfaces/services/IJWTokenService';
import { Inject } from '@nestjs/common';
import { User } from '../../../domain/entities/User';
import { Response } from '../../common/Response';
import { ConfirmUserResponseData } from './ConfirmUserResponseData';
import { confirmUserDto } from './confirmUserDto';

export class ConfirmUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IJWTokenService') private readonly jwTokenService: IJWTokenService,
  ) {}

  async execute(
    dto: confirmUserDto,
  ): Promise<Response<ConfirmUserResponseData>> {
    let user = await this.userRepository.findById(dto.userId);
    if (!user) {
      return new Response<ConfirmUserResponseData>(
        null,
        'Utilisateur non trouvé',
        false,
      );
    }

    let decodedJwt;
    try {
      decodedJwt = await this.jwTokenService.validateToken(dto.token);
    } catch (error) {
      return new Response<ConfirmUserResponseData>(
        null,
        'Jeton de confirmation invalide',
        false,
      );
    }

    if (decodedJwt.sub !== dto.userId) {
      return new Response<ConfirmUserResponseData>(
        null,
        "Jeton de confirmation ne correspond pas à l'utilisateur",
        false,
      );
    }

    try {
      user = await this.userRepository.update(
        new User(
          user.name,
          user.email,
          user.password,
          user.dateOfBirth,
          user.id,
          true,
        ),
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du user :', error);
      return new Response<ConfirmUserResponseData>(
        null,
        "Erreur lors de la mise à jour de l'utilisateur",
        false,
      );
    }

    return new Response<ConfirmUserResponseData>(
      new ConfirmUserResponseData(user, true),
      'Utilisateur confirmé avec succès!',
      true,
    );
  }
}
