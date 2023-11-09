import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login/loginUseCase';
import { LoginDTO } from '../../application/use-cases/login/loginDTO';

@Controller('user')
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    try {
      const result = await this.loginUseCase.execute(loginDto);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
