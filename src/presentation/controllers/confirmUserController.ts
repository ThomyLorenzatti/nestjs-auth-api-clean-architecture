import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { ConfirmUserUseCase } from '../../application/use-cases/confirmUser/confirmUserUseCase';
import * as dotenv from 'dotenv';
import { confirmUserDto } from 'src/application/use-cases/confirmUser/confirmUserDto';

dotenv.config();

@Controller('users')
export class ConfirmUserController {
  constructor(private readonly confirmUserUseCase: ConfirmUserUseCase) {}

  @Get('confirm/:userId/:token')
  @Redirect(`${dotenv.config().parsed.MOBILE_APP_SCHEME}://success`, 301)
  async confirmUser(
    @Param('userId') userId: string,
    @Param('token') token: string,
  ) {
    const dto: confirmUserDto = { userId: parseInt(userId), token: token };
    try {
      const isConfirmed = await this.confirmUserUseCase.execute(dto);

      if (isConfirmed) {
        return {
          statusCode: 200,
          message: 'Confirmation successful',
        };
      } else {
        return {
          statusCode: 400,
          message: 'Confirmation failed',
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
        detail: error.message,
      };
    }
  }
}
