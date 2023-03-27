import { applyDecorators, CanActivate, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { StrategyName } from '../constants/strategyName';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';

/**
 * @function pin to method JwtToken guard via swagger description
 */
export function JWTAuth(): <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol | undefined,
  descriptor?: TypedPropertyDescriptor<Y> | undefined,
) => void {
  const guards: (CanActivate | Function)[] = [JwtAuthGuard];

  return applyDecorators(
    ApiSecurity(StrategyName.jwt),
    ApiBearerAuth(),
    UseGuards(...guards),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

/**
 * @function pin to method JwtRefresToken guard via swagger description
 */
export function JWTRefreshAuth(): <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol | undefined,
  descriptor?: TypedPropertyDescriptor<Y> | undefined,
) => void {
  const guards: (CanActivate | Function)[] = [JwtRefreshAuthGuard];

  return applyDecorators(
    ApiCookieAuth(StrategyName.jwt_refresh),
    UseGuards(...guards),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
