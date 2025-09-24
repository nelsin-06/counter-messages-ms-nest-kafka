import { Module } from '@nestjs/common';
import { RedisAdapter } from './redis.adapter';
import { RedisConnection } from './redis.connection';
import { RedisCountsRepository } from '../repositories/redis-counts.repository';
import { REDIS_PORT } from '../config/services';

@Module({
  providers: [
    RedisConnection,
    {
      provide: REDIS_PORT,
      useClass: RedisAdapter,
    },
    RedisCountsRepository,
  ],
  exports: [
    {
      provide: REDIS_PORT,
      useClass: RedisAdapter,
    },
    RedisCountsRepository,
  ],
})
export class RedisModule {}
