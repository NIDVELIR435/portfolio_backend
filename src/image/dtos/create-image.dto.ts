import { ApiProperty, PickType } from '@nestjs/swagger';
import { Image } from '../../db/entities';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class CreateImageDto extends PickType(Image, [
  'id',
  'url',
  'description',
]) {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  portfolioId: number;
}
