import { IntTimestampEntity } from './utils/int-timestamp.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Comment, Portfolio } from './';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UiTheme } from './enums/ui-theme.enum';

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

  @Column({
    name: 'ui_theme',
    type: 'enum',
    enum: Object.values(UiTheme),
    default: UiTheme.light,
  })
  @ApiProperty({ enum: UiTheme })
  @IsEnum(UiTheme)
  @IsOptional()
  uiTheme: UiTheme;

  @ApiProperty({ type: Portfolio, isArray: true })
  @OneToMany(() => Portfolio, ({ owner }) => owner)
  portfolios: Portfolio[];

  @ApiProperty({ type: Comment, isArray: true })
  @OneToMany(() => Comment, ({ commenter }) => commenter)
  comments: Comment[];
}
