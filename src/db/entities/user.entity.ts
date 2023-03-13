import { IntTimestampEntity } from './utils/int-timestamp.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity('user')
export class User extends IntTimestampEntity {
  @Column({
    name: 'first_name',
    type: 'text',
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'text',
    nullable: false,
  })
  lastName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: '200',
    nullable: false,
  })
  email: string;

  @Column({
    name: 'passport',
    type: 'varchar',
    length: '200',
    nullable: false,
  })
  passport: string;

  @OneToMany(() => Portfolio, ({ owner }) => owner)
  portfolios: Portfolio[];
}
