import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../db/entities';
import { SignInBodyDto } from './dto/sign-in-body.dto';
import { ApiSwagger } from '../common/decorators';
import { StatusCodes } from 'http-status-codes';
import { PureUserDto } from '../user/dtos/pure-user.dto';

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
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful return user access token',
    },
    apiResponses: {
      [StatusCodes.CREATED]: {
        type: String,
      },
    },
  })
  @HttpCode(StatusCodes.OK)
  @UseGuards(LocalAuthGuard)
  signIn(
    @Req() req: Request & { user: User },
    @Body() _body: SignInBodyDto,
  ): string {
    return this.authService.login(req.user);
  }
}
