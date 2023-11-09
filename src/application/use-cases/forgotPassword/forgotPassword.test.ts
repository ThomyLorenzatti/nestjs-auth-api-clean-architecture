import { ForgotPasswordUseCase } from './forgotPasswordUseCase';
import { IMailService } from '../../interfaces/services/IMailService';
import { User } from '../../../domain/entities/User';
import { ForgotPasswordDTO } from './forgotPasswordDTO';

describe('ForgotPasswordUseCase', () => {
  let userRepository: any;
  let jwTokenService: any;
  let mailService: IMailService;
  let forgotPasswordUseCase: ForgotPasswordUseCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
    };

    jwTokenService = {
      generateToken: jest.fn(),
    };

    mailService = {
      sendMail: jest.fn(),
    };

    forgotPasswordUseCase = new ForgotPasswordUseCase(
      userRepository,
      jwTokenService,
      mailService,
    );
  });

  it('should return an error response if user is not found', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    const dto: ForgotPasswordDTO = {
      email: 'test@example.com',
    };

    const result = await forgotPasswordUseCase.execute(dto);

    expect(result.success).toBe(false);
    expect(result.message).toBe('No account found with this email address.');
  });

  it('should send reset password email and return success response', async () => {
    const user = new User('', '', '', new Date());
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);
    (jwTokenService.generateToken as jest.Mock).mockResolvedValue('some-token');
    (mailService.sendMail as jest.Mock).mockResolvedValue(true);

    const dto: ForgotPasswordDTO = {
      email: 'test@example.com',
    };

    const result = await forgotPasswordUseCase.execute(dto);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Password reset email sent!');
  });
});
