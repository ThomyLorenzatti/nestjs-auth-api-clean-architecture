import { Test, TestingModule } from '@nestjs/testing';
import { TypeORMUserRepository } from './TypeORMUserRepository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserORMEntity } from '../orm/entities/UserORMEntity';
import { User } from '../../domain/entities/User';

describe('TypeORMUserRepository', () => {
  let service: TypeORMUserRepository;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeORMUserRepository,
        {
          provide: getRepositoryToken(UserORMEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TypeORMUserRepository>(TypeORMUserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const user = new UserORMEntity();
      user.id = 1;
      user.name = 'test';
      user.email = 'test@test.com';
      user.password = 'hashedPassword';
      user.dateOfBirth = new Date();

      mockRepository.findOne.mockResolvedValue(user);
      const result = await service.findById(1);
      expect(result).toBeInstanceOf(User);
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);
      const result = await service.findById(1);
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save a user', async () => {
      const user = new User(
        'test',
        'test@test.com',
        'hashedPassword',
        new Date(),
      );

      const savedUserEntity = new UserORMEntity();
      savedUserEntity.id = 123;
      savedUserEntity.name = 'test';
      savedUserEntity.email = 'test@test.com';
      savedUserEntity.password = 'hashedPassword';
      savedUserEntity.dateOfBirth = new Date();
      savedUserEntity.email_verified = true;

      mockRepository.save.mockResolvedValue(savedUserEntity);

      const savedUser = await service.save(user);

      expect(savedUser).toBeInstanceOf(User);
      expect(savedUser.id).toEqual(savedUserEntity.id);

      expect(mockRepository.create).toBeCalledWith({
        name: user.name,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        password: user.password,
        email_verified: user.emailVerified,
      });
      expect(mockRepository.save).toBeCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      const user = new UserORMEntity();
      user.id = 1;
      user.name = 'test';
      user.email = 'test@test.com';
      user.password = 'hashedPassword';
      user.dateOfBirth = new Date();

      mockRepository.findOne.mockResolvedValue(user);
      const result = await service.findByEmail('test@test.com');
      expect(result).toBeInstanceOf(User);
    });

    it('should return null when user not found by email', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);
      const result = await service.findByEmail('test@test.com');
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = new User(
        'test',
        'test@test.com',
        'hashedPassword',
        new Date(),
      );
      const userORMEntity = new UserORMEntity();
      userORMEntity.id = 1;
      userORMEntity.name = 'test';
      userORMEntity.email = 'test@test.com';
      userORMEntity.password = 'hashedPassword';
      userORMEntity.dateOfBirth = new Date();

      mockRepository.findOne.mockResolvedValue(userORMEntity);
      await service.remove(user);
      expect(mockRepository.findOne).toBeCalledWith({
        where: { email: user.email },
      });
      expect(mockRepository.remove).toBeCalledWith(userORMEntity);
    });

    it('should not throw an error if user is not found during removal', async () => {
      const user = new User(
        'test',
        'test@test.com',
        'hashedPassword',
        new Date(),
      );
      mockRepository.findOne.mockResolvedValue(undefined);
      await expect(service.remove(user)).resolves.not.toThrow();
    });
  });
});
