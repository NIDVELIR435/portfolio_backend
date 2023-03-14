import { IntTimestampEntity } from './utils/int-timestamp.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Comment, Portfolio } from './';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

@Entity('user')
export class User extends IntTimestampEntity {
  @Column({
    name: 'first_name',
    type: 'text',
    nullable: false,
  })
  @ApiProperty({ type: String })
  @IsString()
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'text',
    nullable: false,
  })
  @ApiProperty({ type: String })
  @IsString()
  lastName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: '200',
    nullable: false,
  })
  @ApiProperty({ type: String, example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: '2000',
    nullable: false,
  })
  @ApiProperty({ type: String })
  @IsString()
  password: string;

  @ApiProperty({ type: Portfolio, isArray: true })
  @OneToMany(() => Portfolio, ({ owner }) => owner)
  portfolios: Portfolio[];

  @ApiProperty({ type: Comment, isArray: true })
  @OneToMany(() => Comment, ({ commenter }) => commenter)
  comments: Comment[];
}
