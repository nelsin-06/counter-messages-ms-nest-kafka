import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CountsServicePort } from '../../domain/ports/counts-service.port';
import { KAFKA_SERVICE } from '../../../../config/services';

/**
 * Adaptador para el servicio de conteos utilizando Kafka
 */
@Injectable()
export class KafkaCountsService implements CountsServicePort, OnModuleInit {
  // ...existing code...
  private readonly logger = new Logger(KafkaCountsService.name);

  constructor(
    @Inject(KAFKA_SERVICE)
    private readonly kafkaClient: ClientKafka,
  ) {}

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('get-counts');
  }

  // ...existing code...
  async getCounts(
    accountId: string,
    from: string,
    to: string,
  ): Promise<Record<string, number>> {
    try {
      this.logger.log(
        `Fetching counts for account: ${accountId}, from: ${from}, to: ${to}`,
      );

      const data = { account_id: accountId, from, to };

      return await lastValueFrom(
        this.kafkaClient.send<Record<string, number>>('get-counts', data),
      );
    } catch (error) {
      this.logger.error(
        `Error fetching counts: ${
          error instanceof Error ? error.message : String(error)
        }`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new Error('Failed to fetch message counts');
    }
  }
}
