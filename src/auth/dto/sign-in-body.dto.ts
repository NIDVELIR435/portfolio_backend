import { PickType } from '@nestjs/swagger';
import { User } from '../../db/entities';

export class SignInBodyDto extends PickType(User, ['email', 'password']) {}
