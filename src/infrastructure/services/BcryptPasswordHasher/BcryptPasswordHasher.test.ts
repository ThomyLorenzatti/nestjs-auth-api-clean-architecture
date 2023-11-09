import { BcryptPasswordHasher } from './BcryptPasswordHasher';
import { Test, TestingModule } from '@nestjs/testing';

describe('BcryptPasswordHasher', () => {
  let service: BcryptPasswordHasher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptPasswordHasher],
    }).compile();

    service = module.get<BcryptPasswordHasher>(BcryptPasswordHasher);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should return a hashed password', async () => {
      const password = 'somePassword';
      const hashed = await service.hash(password);
      expect(hashed).not.toEqual(password);
      expect(hashed.length).toBeGreaterThan(password.length);
    });
  });

  describe('compare', () => {
    it('should return true for matching password and its hash', async () => {
      const password = 'somePassword';
      const hashed = await service.hash(password);
      const isMatch = await service.compare(password, hashed);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password and its hash', async () => {
      const password = 'somePassword';
      const hashed = await service.hash('differentPassword');
      const isMatch = await service.compare(password, hashed);
      expect(isMatch).toBe(false);
    });
  });
});
