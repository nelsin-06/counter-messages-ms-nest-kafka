import { Module } from '@nestjs/common';
import { KafkaModule } from './transports/transports.module';
import { CountsModule } from './context/counts/infrastructure/http-api/counts.module';
import { WebhookModule } from './context/webhook/infrastructure/http-api/webhook.module';

@Module({
  imports: [KafkaModule, CountsModule, WebhookModule],
})
export class AppModule {}
