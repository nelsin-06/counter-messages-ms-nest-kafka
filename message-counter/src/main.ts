import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const logger = new Logger('MessageCounterService');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
        },
        consumer: {
          groupId: 'message-counter-consumer',
        },
        run: {
          // Desactivar auto-commit para control manual
          autoCommit: false,
          autoCommitInterval: null,
          autoCommitThreshold: null,
        },
      },
    },
  );

  // Configure validation pipe to transform DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Auto-transform payloads to DTOs
      whitelist: true, // Strip properties not in the DTO
      forbidNonWhitelisted: false, // Don't throw on extra properties
      forbidUnknownValues: false, // Don't throw on unknown values
      validationError: { target: false }, // Don't include original payload in errors
      stopAtFirstError: false, // Return all errors, not just first
    }),
  );

  // Enable injection for custom validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen();
  logger.log('Message Counter Microservice is running');
  logger.log(`Kafka broker: ${process.env.KAFKA_BROKER || 'localhost:9092'}`);
  logger.log('Consumer group ID: message-counter-consumer');
}
bootstrap().catch((err) => {
  const logger = new Logger('MessageCounterService');
  logger.error('Error starting microservice', err);
});
