import { IntTimestampEntity } from './utils/int-timestamp.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Image, User } from './';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

@Entity('portfolio')
export class Portfolio extends IntTimestampEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ManyToOne(() => User, ({ portfolios }) => portfolios)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'portfolio_user_id__user_id_fk',
  })
  owner: User;

  @OneToMany(() => Image, ({ portfolio }) => portfolio)
  images: Image[];
}
