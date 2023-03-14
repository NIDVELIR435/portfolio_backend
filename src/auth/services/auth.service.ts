import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { User } from '../../db/entities';
import { CreateUserDto } from '../dto/create-user.dto';
import { AppConfigService } from '../../config/app-config.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PureUserDto } from '../../user/dtos/pure-user.dto';

@Injectable()
export class AuthService {
  private readonly bcryptSalt: number;
  constructor(
    private readonly userService: UserService,
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

  public async createUser(body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  public login(user: Partial<User>): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
