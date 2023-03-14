import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class TimestampEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW()' })
  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: 'NOW()' })
  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
