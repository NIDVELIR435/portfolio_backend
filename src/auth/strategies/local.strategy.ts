import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { StrategyName } from '../constants/strategyName';
import { AppConfigService } from '../../config/app-config.service';
import { compare } from 'bcrypt';
import { UserService } from '../../user/services/user.service';
import { PureUserDto } from '../../user/dtos/pure-user.dto';
@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  StrategyName.local,
) {
  private readonly bcryptSalt: number;
  constructor(
    private readonly userService: UserService,
    private readonly appConfigService: AppConfigService,
  ) {
    super({ usernameField: 'email' });

    this.bcryptSalt = this.appConfigService.bcryptSalt;
  }

  async validate(email: string, password: string): Promise<PureUserDto | null> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) return null;

    const isMatch = await compare(password, user.password);
    if (isMatch) return user;

    return null;
  }
}
