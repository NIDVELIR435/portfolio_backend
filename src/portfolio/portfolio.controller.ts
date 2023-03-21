import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JWTAuth } from '../auth/decorators/auth.decorator';
import { ApiSwagger, DecorateAll } from '../common/decorators';
import { StatusCodes } from 'http-status-codes';
import { Request } from 'express';
import { Portfolio, User } from '../db/entities';
import { PortfolioService } from './services/portfolio.service';
import { CreatePortfolioDto } from './dtos/create-portfolio.dto';
import { PureUserDto } from '../user/dtos/pure-user.dto';
import { PortfolioIdParamDto } from '../common/dtos/portfolio-id-param.dto';

@ApiTags('portfolio')
@Controller('portfolio')
@DecorateAll([JWTAuth()])
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}
  @Get('all')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful return all user portfolios',
    },
    apiResponses: {
      [StatusCodes.OK]: {
        type: Portfolio,
        isArray: true,
      },
    },
  })
  @HttpCode(StatusCodes.OK)
  getAllPortfolios(
    @Req() { user }: Request & { user: User },
  ): Promise<Portfolio[]> {
    return this.portfolioService.findAll(user.id);
  }

  @Post('create')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful create new user portfolio',
    },
    apiResponses: {
      [StatusCodes.OK]: {
        type: Portfolio,
        isArray: true,
      },
    },
  })
  @HttpCode(StatusCodes.CREATED)
  createPortfolio(
    @Req() { user }: Request & { user: User },
    @Body() body: CreatePortfolioDto,
  ): Promise<Portfolio> {
    return this.portfolioService.createPortfolio(user, body);
  }

  @Delete(':portfolioId')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful remove portfolio',
    },
    apiResponses: {
      [StatusCodes.OK]: {
        type: Boolean,
      },
    },
  })
  @HttpCode(StatusCodes.OK)
  removePortfolio(
    @Req() { user }: Request & { user: User },
    @Param() param: PortfolioIdParamDto,
  ): Promise<boolean> {
    return this.portfolioService.removePortfolio(user, param);
  }
}
