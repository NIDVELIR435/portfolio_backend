import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AppConfigService } from '../../config/app-config.service';
import { StrategyName } from '../constants/strategyName';
import { UserService } from '../../user/services/user.service';
import { PureUserDto } from '../../user/dtos/pure-user.dto';
import { Request } from 'express';
import { refreshTokenCookieName } from '../constants/refresh_token';
import { get, isNil } from 'lodash';
import { RedisService } from '../../redis/services/redis.service';

const extractJWTFromCookies = (req: Request): string | null =>
  get(req, ['cookies', refreshTokenCookieName], null);

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  StrategyName.jwt_refresh,
) {
  constructor(
    private appConfigService: AppConfigService,
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJWTFromCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  public async validate(
    req: Request,
    payload: {
      sub: number;
      email: string;
    },
  ): Promise<PureUserDto> {
    const refreshTokenFromRedis = await this.redisService.getRefreshToken(
      payload.sub,
    );
    const refreshTokenFromRequest = extractJWTFromCookies(req);

    if (
      isNil(refreshTokenFromRedis) ||
      refreshTokenFromRedis !== refreshTokenFromRequest
    )
      throw new UnauthorizedException();

    return this.userService.findOneById(payload.sub);
  }
}
