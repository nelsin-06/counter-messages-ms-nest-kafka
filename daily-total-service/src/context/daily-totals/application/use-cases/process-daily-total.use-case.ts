import { Inject, Injectable, Logger } from '@nestjs/common';
import { DailyTotalEventDto } from '../dtos/daily-total-event.dto';
import { ExternalNotifierPort } from '../../domain/ports/external-notifier.port';

@Injectable()
export class ProcessDailyTotalUseCase {
  private readonly logger = new Logger(ProcessDailyTotalUseCase.name);

  constructor(
    @Inject('ExternalNotifier')
    private readonly externalNotifier: ExternalNotifierPort,
  ) {}

  async execute(event: DailyTotalEventDto): Promise<void> {
    this.logger.log(`Processing daily total event: ${JSON.stringify(event)}`);

    try {
      await this.externalNotifier.notifyDailyTotal({
        account_id: event.account_id,
        date: event.date,
        total_messages: event.total_messages,
        updated_at: event.updated_at,
      });

      this.logger.log(
        `Successfully sent daily total notification for account ${event.account_id}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing daily total for account ${event.account_id}: ${error.message}`,
        error.stack,
      );
    }
  }
}
