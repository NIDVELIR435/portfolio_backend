import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from '../constants/strategyName';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard(StrategyName.jwt_refresh) {}
