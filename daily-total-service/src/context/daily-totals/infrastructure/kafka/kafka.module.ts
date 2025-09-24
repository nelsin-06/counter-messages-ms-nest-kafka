import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DailyTotalKafkaController } from './kafka.controller';
import { ProcessDailyTotalUseCase } from '../../application/use-cases/process-daily-total.use-case';
import { HttpExternalNotifierAdapter } from '../external-api/external-notifier.adapter';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'daily-total-service',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'daily-total-group',
          },
        },
      },
    ]),
  ],
  controllers: [DailyTotalKafkaController],
  providers: [
    ProcessDailyTotalUseCase,
    HttpExternalNotifierAdapter,
    {
      provide: 'ExternalNotifier',
      useClass: HttpExternalNotifierAdapter,
    },
  ],
})
export class DailyTotalsKafkaModule {}