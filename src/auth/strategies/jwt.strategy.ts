import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AppConfigService } from '../../config/app-config.service';
import { StrategyName } from '../constants/strategyName';
import { UserService } from '../../user/services/user.service';
import { PureUserDto } from '../../user/dtos/pure-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, StrategyName.jwt) {
  constructor(
    private appConfigService: AppConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtSecret,
      passReqToCallback: true,
    });
  }

  public async validate(
    request: Request,
    payload: { userId: number; email: string },
  ): Promise<PureUserDto> {
    return await this.userService.findOneById(payload.userId);
  }
}
