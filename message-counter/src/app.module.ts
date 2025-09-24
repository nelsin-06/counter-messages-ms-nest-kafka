import { Module } from '@nestjs/common';
import { KafkaModule } from './context/messages/infrastructure/kafka/kafka.module';
import { RedisModule } from './context/messages/infrastructure/redis/redis.module';
/**
 * Main application module that imports all feature modules
 */
@Module({
  imports: [KafkaModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
