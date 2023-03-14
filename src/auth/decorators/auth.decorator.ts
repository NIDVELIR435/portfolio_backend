import { applyDecorators, CanActivate, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { StrategyName } from '../constants/strategyName';

/**
 * @function pin to method JwtCognito, DynamoRole And DynamoType guards
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
