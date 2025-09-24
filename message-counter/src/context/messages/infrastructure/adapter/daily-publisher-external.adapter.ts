import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DailyTotalPublisherPort } from '../../domain/ports/daily-publisher-external.port';
import { KAFKA_SERVICE } from '../config/services';

export const DAILY_TOTAL_TOPIC = 'daily-total-updated';

@Injectable()
export class KafkaDailyTotalPublisherAdapter
  implements DailyTotalPublisherPort
{
  private readonly logger = new Logger(KafkaDailyTotalPublisherAdapter.name);

  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  publishDailyTotal(event: {
    accountId: string;
    date: string;
    totalMessages: number;
    updatedAt: string;
  }): void {
    const payload = {
      event: 'daily_total_updated',
      version: 1,
      account_id: event.accountId,
      date: event.date,
      total_messages: event.totalMessages,
      updated_at: event.updatedAt,
      source: 'message-counter',
    };
    try {
      this.kafkaClient.emit(DAILY_TOTAL_TOPIC, payload);
    } catch (err) {
      this.logger.error(`Failed to publish daily total event`, err);
    }
  }
}
