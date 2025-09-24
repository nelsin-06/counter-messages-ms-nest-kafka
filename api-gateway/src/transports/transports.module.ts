import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_SERVICE } from '../config/services';

const clientModule = ClientsModule.register([
  {
    name: KAFKA_SERVICE,
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
      },
    },
  },
]);

@Module({
  imports: [clientModule],
  exports: [clientModule],
})
export class KafkaModule {}
