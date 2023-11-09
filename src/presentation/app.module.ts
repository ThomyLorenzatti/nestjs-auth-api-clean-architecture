import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

import { CreateUserController } from './controllers/createUserController';
import { LoginController } from './controllers/loginController';
import { ConfirmUserController } from './controllers/confirmUserController';
import { ForgotPasswordController } from './controllers/forgotPasswordController';
import { ResetPasswordController } from './controllers/resetPasswordController';

import { CreateUserUseCase } from '../application/use-cases/createUser/createUserUseCase';
import { LoginUseCase } from '../application/use-cases/login/loginUseCase';
import { ConfirmUserUseCase } from '../application/use-cases/confirmUser/confirmUserUseCase';
import { ForgotPasswordUseCase } from '../application/use-cases/forgotPassword/forgotPasswordUseCase';
import { ResetPasswordUseCase } from '../application/use-cases/resetPassword/resetPasswordUseCase';

import { UserORMEntity } from '../infrastructure/orm/entities/UserORMEntity';
import { TypeORMUserRepository } from '../infrastructure/repositories/TypeORMUserRepository';
import { typeOrmConfig } from '../infrastructure/config/typeorm.config';
import { BcryptPasswordHasher } from '../infrastructure/services/BcryptPasswordHasher/BcryptPasswordHasher';
import { JWTokenService } from '../infrastructure/services/JWTokenService/JWTokenService';
import { MailService } from '../infrastructure/services/MailService/MailService';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: dotenv.config().parsed.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UserORMEntity]),
  ],
  controllers: [
    CreateUserController,
    LoginController,
    ConfirmUserController,
    ForgotPasswordController,
    ResetPasswordController,
  ],
  providers: [
    CreateUserUseCase,
    LoginUseCase,
    ConfirmUserUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    {
      provide: 'IUserRepository',
      useClass: TypeORMUserRepository,
    },
    {
      provide: 'IPasswordHasher',
      useClass: BcryptPasswordHasher,
    },
    {
      provide: 'IJWTokenService',
      useFactory: (jwtService: JwtService) => {
        return new JWTokenService(jwtService);
      },
      inject: [JwtService],
    },
    {
      provide: 'IMailService',
      useClass: MailService,
    },
  ],
})
export class AppModule {}
