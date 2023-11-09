import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/createUser/createUserUseCase';
import { CreateUserDTO } from '../../application/use-cases/createUser/createUserDTO';
import { Response } from '../../application/common/Response';

@Controller('user/register')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDTO): Promise<Response<any> | void> {
    try {
      const response = await this.createUserUseCase.execute(dto);

      if (!response.success) {
        throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
      }

      return {
        data: response.data,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
