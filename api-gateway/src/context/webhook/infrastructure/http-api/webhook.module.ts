import { Module } from '@nestjs/common';
import { ProcessWebhookUseCase } from '../../application/use-cases/process-webhook.use-case';
import { WEBHOOK_PROCESSOR_PORT } from '../../domain/ports/tokens';
import { KafkaWebhookProcessor } from '../kafka/kafka-webhook-processor';
import { WebhookController } from './webhook.controller';
import { KafkaModule } from '../../../../transports/transports.module';

@Module({
  imports: [KafkaModule],
  controllers: [WebhookController],
  providers: [
    ProcessWebhookUseCase,
    {
      provide: WEBHOOK_PROCESSOR_PORT,
      useClass: KafkaWebhookProcessor,
    },
  ],
})
export class WebhookModule {}
