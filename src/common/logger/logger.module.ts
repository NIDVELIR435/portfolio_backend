import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';
import { LoggerMiddleware } from './logger.middleware';
import { AppConfigModule } from '../../config/appConfigModule';

@Module({
  imports: [AppConfigModule],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule implements NestModule {
  //will catch errors
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
