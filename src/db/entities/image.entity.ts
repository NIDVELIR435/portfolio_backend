import { IntTimestampEntity } from './utils/int-timestamp.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Portfolio, Comment } from './';

@Entity('image')
export class Image extends IntTimestampEntity {
  @Column({
    name: 'url',
    type: 'text',
    nullable: false,
  })
  url: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;

  @ManyToOne(() => Portfolio, ({ images }) => images)
  @JoinColumn({
    name: 'portfolio_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'image_portfolio_id__portfolio_id_fk',
  })
  portfolio: Portfolio;

  @ManyToMany(() => Comment, ({ images }) => images)
  @JoinTable({
    name: 'image_comment',
    joinColumn: {
      name: 'image_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'image_comment_image_id__image_id_fk',
    },
    inverseJoinColumn: {
      name: 'comment_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'image_comment_comment_id__comment_id_fk',
    },
  })
  comments: Comment[];
}
