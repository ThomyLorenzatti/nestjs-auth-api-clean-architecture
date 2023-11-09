import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDTO {
  @ApiProperty()
  token: string;

  @ApiProperty()
  newPassword: string;
}
