import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);

  // Configuración para conectar a Kafka
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
        clientId: 'daily-total-service',
      },
      consumer: {
        groupId: 'daily-total-group',
        allowAutoTopicCreation: true,
      },
      run: {
        autoCommit: false, // commits manuales
        autoCommitInterval: null,
        autoCommitThreshold: null,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);

  logger.log('Daily Total Service is running on: http://localhost:3001');
  logger.log('Connected to Kafka as consumer for topic: daily-total-updated');
}
bootstrap();
