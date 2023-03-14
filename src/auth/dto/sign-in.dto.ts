import { PickType } from '@nestjs/swagger';
import { User } from '../../db/entities';

export class SignInDto extends PickType(User, ['email', 'password']) {}
