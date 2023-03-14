import { ApiProperty } from '@nestjs/swagger';

export class ErrorExceptionDto {
  @ApiProperty({ required: true })
  statusCode: number;

  @ApiProperty({ required: true })
  message: string;

  @ApiProperty({ required: true })
  error: string;
}
