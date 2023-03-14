import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class TimestampEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: 'NOW()' })
  updatedAt: Date;
}
