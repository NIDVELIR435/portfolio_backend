import { Inject } from '@nestjs/common';
import { REDIS_PROVIDER } from '../constants/redis-provider-name.constant';
import { Redis } from 'ioredis';

export class RedisService {
  constructor(@Inject(REDIS_PROVIDER) private redis: Redis) {}

  public async getRefreshToken(userId: number): Promise<string> {
    return this.redis.get(this.assembleUserKey(userId));
  }

  public async setRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<'OK'> {
    return this.redis.set(this.assembleUserKey(userId), refreshToken);
  }

  public async clearUserToken(userId: number): Promise<number> {
    return this.redis.del(this.assembleUserKey(userId));
  }

  private assembleUserKey(userId: number) {
    return `auth:user:${userId}:refresh_token`;
  }
}
