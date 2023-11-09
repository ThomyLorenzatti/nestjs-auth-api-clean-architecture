import { LoginUseCase } from './loginUseCase';
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../interfaces/repositories/IUserRepository';
import { IPasswordHasher } from '../../interfaces/services/IPasswordHasher';
import { IJWTokenService } from '../../interfaces/services/IJWTokenService';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockUserRepository: Partial<IUserRepository>;
  let mockPasswordHasher: Partial<IPasswordHasher>;
  let mockJWTokenService: Partial<IJWTokenService>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
    };

    mockPasswordHasher = {
      compare: jest.fn(),
    };

    mockJWTokenService = {
      generateToken: jest.fn(),
    };

    loginUseCase = new LoginUseCase(
      mockUserRepository as IUserRepository,
      mockPasswordHasher as IPasswordHasher,
      mockJWTokenService as IJWTokenService,
    );
  });

  it('should return "User not found" if user does not exist', async () => {
    mockUserRepository.findByEmail = jest.fn().mockResolvedValueOnce(null);

    const response = await loginUseCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(response.message).toBe('User not found.');
    expect(response.success).toBe(false);
  });

  it('should return "Invalid password" if password is incorrect', async () => {
    const mockUser = new User(
      'John Doe',
      'test@example.com',
      'hashedpassword',
      new Date(),
    );
    (mockUserRepository.findByEmail as jest.Mock).mockResolvedValueOnce(
      mockUser,
    );
    (mockPasswordHasher.compare as jest.Mock).mockResolvedValueOnce(false);

    const response = await loginUseCase.execute({
      email: 'test@example.com',
      password: 'wrongpassword',
    });
    expect(response.message).toBe('Invalid password.');
    expect(response.success).toBe(false);
  });

  it('should return token and user data if login is successful', async () => {
    const mockUser = new User(
      'John Doe',
      'test@example.com',
      'hashedpassword',
      new Date(),
    );
    (
      mockUserRepository.findByEmail as jest.Mock<Promise<User>>
    ).mockResolvedValueOnce(mockUser);
    (
      mockPasswordHasher.compare as jest.Mock<Promise<boolean>>
    ).mockResolvedValueOnce(true);
    (
      mockJWTokenService.generateToken as jest.Mock<Promise<string>>
    ).mockResolvedValueOnce('mockToken');

    const response = await loginUseCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(response.message).toBe('Login successful.');
    expect(response.success).toBe(true);
    expect(response.data).toEqual({
      email: 'test@example.com',
      id: null,
      name: 'John Doe',
      token: 'mockToken',
    });
  });
});
