import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserAuth } from '../db/entities';
import { AppConfigModule } from '../config/appConfigModule';
import { UserAuthService } from './services/user-auth.service';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([User, UserAuth])],
  controllers: [UserController],
  providers: [UserService, UserAuthService],
  exports: [UserService, UserAuthService],
})
export class UserModule {}
