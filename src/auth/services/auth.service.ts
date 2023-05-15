import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { User } from '../../db/entities';
import { CreateUserDto } from '../dto/create-user.dto';
import { AppConfigService } from '../../config/app-config.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PureUserDto } from '../../user/dtos/pure-user.dto';
import { isNil } from 'lodash';
import { AuthTokenDto } from '../dto/AuthTokens.sto';
import { RedisService } from '../../redis/services/redis.service';

@Injectable()
export class AuthService {
  private readonly bcryptSalt: number;
  constructor(
    private readonly userService: UserService,
    private readonly appConfigService: AppConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {
    this.bcryptSalt = this.appConfigService.bcryptSalt;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<PureUserDto | null> {
    const user = await this.userService.findOneByEmail(email);

    if (await compare(password, user.password)) return user;

    return null;
  }

  public async createUser(body: CreateUserDto): Promise<PureUserDto> {
    return this.userService.createUser(body);
  }

  public async login(user: Partial<User>): Promise<AuthTokenDto> {
    const payload = { email: user.email, sub: user.id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.appConfigService.jwtRefreshSecret,
        expiresIn: this.appConfigService.jwtRefreshExpiresIn,
      }),
    ]);
    await this.redisService.setRefreshToken(
      user.id,
      refreshToken,
      this.jwtService.decode(refreshToken)['exp'],
    );

    return { accessToken, refreshToken };
  }

  public async refreshToken({
    token,
    user,
  }: {
    token: string;
    user: PureUserDto;
  }): Promise<AuthTokenDto> {
    const decoded = this.jwtService.decode(token) as {
      email: User['email'];
      sub: User['id'];
    };

    if (isNil(decoded))
      throw new BadRequestException('Cannot decode refresh token');

    const refreshToken = await this.redisService.getRefreshToken(user.id);

    if (isNil(refreshToken)) throw new UnauthorizedException();

    const isRefreshTokenMatching = token === refreshToken;

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.jwtService.verifyAsync(token, {
      secret: this.appConfigService.jwtRefreshSecret,
    });
    return this.login(user);
  }

  public logout(id: number): Promise<boolean> {
    return this.redisService.clearUserToken(id).then(() => true);
  }
}
