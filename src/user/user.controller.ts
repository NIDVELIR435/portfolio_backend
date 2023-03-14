import { Controller, Get, HttpCode, Req } from '@nestjs/common';
import { UserService } from './services/user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiSwagger, DecorateAll } from '../common/decorators';
import { StatusCodes } from 'http-status-codes';
import { Request } from 'express';
import { JWTAuth } from '../auth/decorators/auth.decorator';
import { User } from '../db/entities';
import { PureUserDto } from './dtos/pure-user.dto';

@ApiTags('user')
@Controller('user')
@DecorateAll([JWTAuth()])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful return user info from jwt token',
    },
    apiResponses: {
      [StatusCodes.OK]: {
        type: PureUserDto,
      },
    },
  })
  @HttpCode(StatusCodes.OK)
  returnUserInfo(@Req() { user }: Request & { user: User }): PureUserDto {
    return user;
  }
}
