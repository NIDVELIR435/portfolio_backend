import { IntTimestampEntity } from './utils/int-timestamp.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('portfolio')
export class Portfolio extends IntTimestampEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description?: string;

  @ManyToOne(() => User, ({ portfolios }) => portfolios)
  owner: User;
}
