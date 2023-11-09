import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ResetPasswordUseCase } from '../../application/use-cases/resetPassword/resetPasswordUseCase';
import { ResetPasswordDTO } from '../../application/use-cases/resetPassword/resetPasswordDTO';

@Controller('user')
export class ResetPasswordController {
  constructor(private readonly resetPasswordUseCase: ResetPasswordUseCase) {}

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDTO) {
    try {
      const result = await this.resetPasswordUseCase.execute(resetPasswordDto);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        message: result.message,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
