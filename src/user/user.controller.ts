import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Req,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiSwagger, DecorateAll } from '../common/decorators';
import { StatusCodes } from 'http-status-codes';
import { Request } from 'express';
import { JWTAuth } from '../auth/decorators/auth.decorator';
import { User } from '../db/entities';
import { PureUserDto } from './dtos/pure-user.dto';
import { UpdateUserUiThemeBodyDto } from './dtos/update-user-ui-theme.body.dto';

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

  @Patch('update-ui-theme')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful change user ui theme configuration',
    },
    apiResponses: {
      [StatusCodes.OK]: {
        type: Boolean,
      },
    },
  })
  @HttpCode(StatusCodes.OK)
  updateUserUiTheme(
    @Req() { user }: Request & { user: User },
    @Body() body: UpdateUserUiThemeBodyDto,
  ): Promise<boolean> {
    return this.userService.updateUserUiTheme(user.id, body);
  }

  @Delete()
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful remove user',
    },
    apiResponses: {
      [StatusCodes.OK]: {
        type: Boolean,
      },
    },
  })
  @HttpCode(StatusCodes.OK)
  removeUser(@Req() { user }: Request & { user: User }): Promise<boolean> {
    return this.userService.removeUser(user.id);
  }
}
