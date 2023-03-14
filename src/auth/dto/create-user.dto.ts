import { PickType } from '@nestjs/swagger';
import { User } from '../../db/entities';

export class CreateUserDto extends PickType(User, [
  'email',
  'firstName',
  'lastName',
  'password',
]) {}
