import { ConfirmUserUseCase } from './confirmUserUseCase';
import { IUserRepository } from '../../interfaces/repositories/IUserRepository';
import { IJWTokenService } from '../../interfaces/services/IJWTokenService';
import { User } from '../../../domain/entities/User';
import { confirmUserDto } from './confirmUserDto';

describe('ConfirmUserUseCase', () => {
  let userRepository: IUserRepository;
  let jwTokenService: IJWTokenService;
  let confirmUserUseCase: ConfirmUserUseCase;
  let dto: confirmUserDto;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    };

    jwTokenService = {
      generateToken: jest.fn(),
      validateToken: jest.fn(),
    };

    confirmUserUseCase = new ConfirmUserUseCase(userRepository, jwTokenService);

    dto = { userId: 1, token: 'token' };
  });

  it('should return error response if user is not found', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(null);
    const result = await confirmUserUseCase.execute(dto);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Utilisateur non trouvé');
  });

  it('should return error response if token is invalid', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(
      new User('', '', '', new Date()),
    );
    (jwTokenService.validateToken as jest.Mock).mockRejectedValue(new Error());
    const result = await confirmUserUseCase.execute(dto);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Jeton de confirmation invalide');
  });

  it('should return error response if token does not match user', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(
      new User('', '', '', new Date()),
    );
    (jwTokenService.validateToken as jest.Mock).mockResolvedValue({ sub: 2 });
    const result = await confirmUserUseCase.execute(dto);
    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Jeton de confirmation ne correspond pas à l'utilisateur",
    );
  });

  it('should return success response if user is confirmed successfully', async () => {
    const user = new User(
      'John',
      'john@example.com',
      'password',
      new Date('1990-01-01'),
      1,
    );
    (userRepository.findById as jest.Mock).mockResolvedValue(user);
    (jwTokenService.validateToken as jest.Mock).mockResolvedValue({ sub: 1 });
    (userRepository.update as jest.Mock).mockResolvedValue(user);

    const result = await confirmUserUseCase.execute(dto);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Utilisateur confirmé avec succès!');
    expect(result.data.confirmed).toBe(true);
  });
});
