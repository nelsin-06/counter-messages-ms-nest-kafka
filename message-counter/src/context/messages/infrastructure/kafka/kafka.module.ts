import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { KafkaModuleBroker } from '../transports/transports.module';
import { ProcessMessageUseCase } from '../../application/use-cases/process-message.use-case';
import { RedisCountsRepository } from '../repositories/redis-counts.repository';
import { GetHourlyCountsRangeUseCase } from '../../application/use-cases/get-hourly-counts-range.use-case';
import { RedisModule } from '../redis/redis.module';
import { KafkaDailyTotalPublisherAdapter } from '../adapter/daily-publisher-external.adapter';
import { COUNTS_REPOSITORY, DAILY_TOTAL_PUBLISHER } from '../config/services';

@Module({
  imports: [KafkaModuleBroker, RedisModule],
  controllers: [KafkaController],
  providers: [
    ProcessMessageUseCase,
    GetHourlyCountsRangeUseCase,
    KafkaDailyTotalPublisherAdapter,
    {
      provide: COUNTS_REPOSITORY, // Registrar la implementación concreta
      useClass: RedisCountsRepository,
    },
    {
      provide: DAILY_TOTAL_PUBLISHER, // Registrar el publicador de totales diarios
      useClass: KafkaDailyTotalPublisherAdapter,
    },
  ],
})
export class KafkaModule {}
