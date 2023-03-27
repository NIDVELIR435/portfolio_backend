import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../db/entities';
import { ApiSwagger } from '../common/decorators';
import { StatusCodes } from 'http-status-codes';
import { PureUserDto } from '../user/dtos/pure-user.dto';
import { JWTAuth, JWTRefreshAuth } from './decorators/auth.decorator';
import { AuthTokenDto } from './dto/AuthTokens.sto';
import { Request } from 'express';
import { get } from 'lodash';
import { refreshTokenCookieName } from './constants/refresh_token';
import { SignInBodyDto } from './dto/sign-in-body.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful create new user',
    },
    apiResponses: {
      [StatusCodes.CREATED]: {
        type: PureUserDto,
      },
    },
  })
  @HttpCode(StatusCodes.CREATED)
  create(@Body() body: CreateUserDto): Promise<PureUserDto> {
    return this.authService.createUser(body);
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful return user tokens',
    },
    apiResponses: {
      [StatusCodes.CREATED]: {
        type: AuthTokenDto,
      },
    },
  })
  @HttpCode(StatusCodes.OK)
  signIn(
    @Req() req: Request & { user: User },
    @Body() _body: SignInBodyDto,
  ): Promise<AuthTokenDto> {
    return this.authService.login(req.user);
  }

  @Post('refresh-token')
  @JWTRefreshAuth()
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful return user access token',
    },
    apiResponses: {
      [StatusCodes.CREATED]: {
        type: AuthTokenDto,
      },
    },
  })
  @HttpCode(StatusCodes.OK)
  refreshToken(
    @Req() { cookies, user }: Request & { user: User },
  ): Promise<AuthTokenDto> {
    const token = get<string>(cookies, refreshTokenCookieName, null);

    return this.authService.refreshToken({ token, user });
  }

  @Get('sign-out')
  @JWTAuth()
  @ApiSwagger({
    apiOperation: {
      summary: 'sign out',
    },
    apiResponses: {
      [StatusCodes.CREATED]: {
        type: String,
      },
    },
  })
  @HttpCode(200)
  async logOut(@Req() req: Request & { user: User }, @Res() res: Response) {
    await this.authService.removeRefreshToken(req.user.email);
    res.headers.set('Authorization', null);
  }
}
