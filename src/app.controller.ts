import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiSwagger } from './common/decorators';
import { StatusCodes } from 'http-status-codes';

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log('app');
  }

  @Get('health-check')
  @ApiSwagger({
    apiOperation: {
      summary: 'Should successful return boolean value',
    },
    apiResponses: {
      [StatusCodes.OK]: {
        type: Boolean,
      },
    },
  })
  healthCheck(): boolean {
    return this.appService.healthCheck();
  }
}
