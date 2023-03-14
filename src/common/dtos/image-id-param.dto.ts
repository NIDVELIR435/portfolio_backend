import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ImageIdParamDto {
  @ApiProperty({
    example: '1',
    description: 'integer',
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  imageId: number;
}
