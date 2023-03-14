import { PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from './timestamp.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class IntTimestampEntity extends TimestampEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  id: number;
}
