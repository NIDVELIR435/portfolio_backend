import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../db/entities';
import { SignInBodyDto } from './dto/sign-in-body.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  create(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.createUser(body);
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  signIn(
    @Req() req: Request & { user: User },
    @Body() _body: SignInBodyDto,
  ): string {
    return this.authService.login(req.user);
  }
}
