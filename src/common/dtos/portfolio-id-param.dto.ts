import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PortfolioIdParamDto {
  @ApiProperty({
    example: '1',
    description: 'integer',
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  portfolioId: number;
}
