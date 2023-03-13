import { IntTimestampEntity } from './utils/int-timestamp.entity';
import { Entity } from 'typeorm';

@Entity('image')
export class Image extends IntTimestampEntity {}
