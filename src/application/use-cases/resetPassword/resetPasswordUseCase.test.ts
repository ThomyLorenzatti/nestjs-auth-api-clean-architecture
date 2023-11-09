import { ResetPasswordUseCase } from './resetPasswordUseCase';

describe('ResetPasswordUseCase', () => {
  let resetPasswordUseCase: ResetPasswordUseCase;
  let userRepository: any;
  let jwTokenService: any;
  let passwordHasher: any;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };

    jwTokenService = {
      generateToken: jest.fn(),
      validateToken: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn(),
    };

    resetPasswordUseCase = new ResetPasswordUseCase(
      userRepository,
      jwTokenService,
      passwordHasher,
    );
  });

  it('should reset password successfully', async () => {
    const resetToken = 'some-reset-token';
    const newPassword = 'newPassword123';
    const userId = 'user-id';

    // Mocking the method's implementation
    (userRepository.findById as jest.Mock).mockResolvedValue({
      id: userId,
    });
    (jwTokenService.validateToken as jest.Mock).mockResolvedValue({
      sub: userId,
    });
    (passwordHasher.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const response = await resetPasswordUseCase.execute({
      token: resetToken,
      newPassword,
    });

    expect(response.success).toBe(true);
    expect(response.message).toBe('Password has been reset successfully.');
    expect(userRepository.update).toHaveBeenCalled();
  });

  // Add more tests as necessary
});
