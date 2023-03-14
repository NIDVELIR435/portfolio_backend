import { PickType } from '@nestjs/swagger';
import { Portfolio } from '../../db/entities';

export class CreatePortfolioDto extends PickType(Portfolio, [
  'name',
  'description',
]) {}
