import { IntTimestampEntity } from './utils/int-timestamp.entity';
import { Column, Entity, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User, Image } from './';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@Entity('comment')
export class Comment extends IntTimestampEntity {
  @Column({
    name: 'message',
    type: 'text',
    nullable: false,
  })
  @ApiProperty({ type: String })
  @IsString()
  message: string;

  @ManyToOne(() => User, ({ comments }) => comments)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'comment_user_id__user_id_fk',
  })
  commenter: User;

  @ManyToMany(() => Image, ({ comments }) => comments)
  images: Image[];
}
