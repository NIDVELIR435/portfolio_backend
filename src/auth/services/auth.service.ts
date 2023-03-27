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
import { UserAuthService } from '../../user/services/user-auth.service';

@Injectable()
export class AuthService {
  private readonly bcryptSalt: number;
  constructor(
    private readonly userService: UserService,
    private readonly userAuthService: UserAuthService,
    private readonly appConfigService: AppConfigService,
    private jwtService: JwtService,
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

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfigService.jwtSecret,
      expiresIn: this.appConfigService.jwtExpiresIn,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: this.appConfigService.jwtRefreshExpiresIn,
    });

    await this.userAuthService.setCurrentRefreshToken({
      refreshToken,
      userId: payload.sub,
      salt: this.bcryptSalt,
    });

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

    const userAuth = await this.userAuthService.findOneByUserId(decoded.sub);
    if (isNil(userAuth)) throw new UnauthorizedException();

    const isRefreshTokenMatching = await compare(token, userAuth.refreshToken);

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.jwtService.verifyAsync(token, {
      secret: this.appConfigService.jwtRefreshSecret,
    });
    return this.login(user);
  }

  public removeRefreshToken(email: string): Promise<boolean> {
    return this.userAuthService.removeRefreshToken(email);
  }
}
