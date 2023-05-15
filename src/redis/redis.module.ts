import { Global, Module } from '@nestjs/common';
import { AppConfigService } from '../config/app-config.service';
import { Redis } from 'ioredis';
import { REDIS_PROVIDER } from './constants/redis-provider-name.constant';
import { RedisService } from './services/redis.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_PROVIDER,
      inject: [AppConfigService],
      useFactory: ({ redisHost, redisPort }: AppConfigService) =>
        new Redis({
          host: redisHost,
          port: redisPort,
        }),
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
