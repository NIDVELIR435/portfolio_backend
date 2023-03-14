import { Controller, Get, HttpCode, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiSwagger, DecorateAll } from '../common/decorators';
import { StatusCodes } from 'http-status-codes';
import { Request } from 'express';

@ApiTags('user')
@Controller('user')
@DecorateAll([])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful return user info from token',
      description: 'in dynamo = getUserDetails',
    },
    apiResponses: {
      // [StatusCodes.OK]: {
      //   type: '', //todo,
      // },
    },
  })
  @HttpCode(StatusCodes.OK)
  returnUserInfo(@Req() { headers }: Request) {
    return headers;
  }
}
