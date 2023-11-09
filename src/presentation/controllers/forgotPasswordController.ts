import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ForgotPasswordUseCase } from '../../application/use-cases/forgotPassword/forgotPasswordUseCase';
import { Response } from '../../application/common/Response';
import { ForgotPasswordDTO } from '../../application/use-cases/forgotPassword/forgotPasswordDTO';

@Controller('user')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDTO: ForgotPasswordDTO,
  ): Promise<Response<void>> {
    try {
      return await this.forgotPasswordUseCase.execute(forgotPasswordDTO);
    } catch (error) {
      return new Response<void>(
        null,
        error.message || 'An unexpected error occurred',
        false,
      );
    }
  }
}
