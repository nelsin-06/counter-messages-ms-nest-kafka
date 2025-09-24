import { Module } from '@nestjs/common';
import { DailyTotalsKafkaModule } from './context/daily-totals/infrastructure/kafka/kafka.module';

@Module({
  imports: [DailyTotalsKafkaModule],
})
export class AppModule {}