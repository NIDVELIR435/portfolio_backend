import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from '../constants/strategyName';

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyName.jwt) {}
