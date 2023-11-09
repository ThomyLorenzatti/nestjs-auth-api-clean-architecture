import { CreateUserUseCase } from './createUserUseCase';
import { CreateUserDTO } from './createUserDTO';
import { User } from '../../../domain/entities/User';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: any;
  let mockPasswordHasher: any;
  let mockJWTokenService: any;
  let mockMailService: any;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    mockPasswordHasher = {
      hash: jest.fn(),
    };

    mockJWTokenService = {
      generateToken: jest.fn(),
    };

    mockMailService = {
      sendMail: jest.fn(),
    };

    createUserUseCase = new CreateUserUseCase(
      mockUserRepository,
      mockPasswordHasher,
      mockJWTokenService,
      mockMailService,
    );
  });

  it('should throw an error if user already exists', async () => {
    const dto: CreateUserDTO = {
      name: 'John',
      email: 'john@example.com',
      password: 'password123',
      dateOfBirth: new Date(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(
      new User(
        'John',
        'john@example.com',
        'password123',
        new Date('1990-01-01'),
      ),
    );

    const result = await createUserUseCase.execute(dto);

    expect(result.success).toBe(false);
    expect(result.message).toBe('User with this email already exists.');
  });

  it('should create a user and return a token if user does not exist', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockPasswordHasher.hash.mockResolvedValue('hashedpassword123');
    mockJWTokenService.generateToken.mockResolvedValue('sample-token');

    const dto: CreateUserDTO = {
      name: 'John',
      email: 'john@example.com',
      password: 'password123',
      dateOfBirth: new Date(),
    };

    mockUserRepository.save.mockResolvedValue({
      ...dto,
      id: 'sample-id',
    });

    const result = await createUserUseCase.execute(dto);

    expect(result.success).toBe(true);
    expect(result.message).toBe('User created successfully!');
    expect(result.data.token).toBe('sample-token');
    expect(mockJWTokenService.generateToken).toHaveBeenCalled();
  });
});
