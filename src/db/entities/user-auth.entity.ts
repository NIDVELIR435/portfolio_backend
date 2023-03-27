import { IntTimestampEntity } from './utils/int-timestamp.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

@Entity('user_auth')
export class UserAuth extends IntTimestampEntity {
  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  @ApiProperty({ type: String })
  @MaxLength(1000)
  @IsOptional()
  refreshToken: string | null;

  @ApiProperty({ type: () => User, isArray: false })
  @ManyToOne(() => User, ({ userAuths }) => userAuths)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'user_auth_user_id__user_id_fk',
  })
  user: User;
}
