import { Test, TestingModule } from '@nestjs/testing';
import { JWTokenService } from './JWTokenService';
import { JwtService } from '@nestjs/jwt';

describe('JWTokenService', () => {
  let service: JWTokenService;
  let mockJwtService: Partial<JwtService>;

  beforeEach(async () => {
    mockJwtService = {
      sign: jest.fn().mockImplementation((payload) => JSON.stringify(payload)),
      verify: jest.fn().mockImplementation((token) => JSON.parse(token)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JWTokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<JWTokenService>(JWTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should return a token for a given userId', async () => {
      const userId = 123;
      const token = await service.generateToken(userId);
      expect(token).toBe(JSON.stringify({ sub: userId }));
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: userId });
    });
  });

  describe('validateToken', () => {
    it('should return a payload for a given token', async () => {
      const token = JSON.stringify({ sub: 123 });
      const payload = await service.validateToken(token);
      expect(payload).toEqual({ sub: 123 });
      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
    });
  });
});
