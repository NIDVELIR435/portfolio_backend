import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AppConfigService } from '../../config/app-config.service';
import { StrategyName } from '../constants/strategyName';
import { UserService } from '../../user/services/user.service';
import { PureUserDto } from '../../user/dtos/pure-user.dto';
import { Request } from 'express';
import { refreshTokenCookieName } from '../constants/refresh_token';
import { get } from 'lodash';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  StrategyName.jwt_refresh,
) {
  constructor(
    private appConfigService: AppConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtRefreshSecret,
      passReqToCallback: false,
    });
  }

  public async validate(payload: {
    sub: number;
    email: string;
  }): Promise<PureUserDto> {
    return this.userService.findOneById(payload.sub);
  }

  private static extractJWT(req: Request): string | null {
    return get(req, ['cookies', refreshTokenCookieName], null);
  }
}
