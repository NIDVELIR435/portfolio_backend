import { Controller, Get, HttpCode, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JWTAuth } from '../auth/decorators/auth.decorator';
import { ApiSwagger, DecorateAll } from '../common/decorators';
import { StatusCodes } from 'http-status-codes';
import { Request } from 'express';
import { Portfolio, User } from '../db/entities';
import { PortfolioService } from './services/portfolio.service';

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
}
