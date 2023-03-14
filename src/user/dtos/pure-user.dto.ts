import { User } from '../../db/entities';
import { OmitType } from '@nestjs/swagger';

export class PureUserDto extends OmitType(User, ['comments', 'portfolios']) {}
