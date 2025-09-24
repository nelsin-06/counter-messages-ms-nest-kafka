import { Injectable, Logger, Inject } from '@nestjs/common';
import { ProcessMessageDto } from '../dtos/process-message.dto';
import { CountsRepository } from '../../domain/repositories/counts.repository';
import { Message } from '../../domain/entities/message.entity';
import { MessageId } from '../../domain/value-objects/message-id.vo';
import { AccountId } from '../../domain/value-objects/account-id.vo';
import { DuplicateMessageException } from '../../domain/exceptions/duplicate-message.exception';
import { MessageProcessingException } from '../../domain/exceptions/message-processing.exception';
import { DailyTotalPublisherPort } from '../../domain/ports/daily-publisher-external.port';
import {
  COUNTS_REPOSITORY,
  DAILY_TOTAL_PUBLISHER,
} from '../../infrastructure/config/services';

@Injectable()
export class ProcessMessageUseCase {
  private readonly logger = new Logger(ProcessMessageUseCase.name);

  constructor(
    @Inject(COUNTS_REPOSITORY) // Usar el token registrado en el módulo
    private readonly countsRepository: CountsRepository,
    @Inject(DAILY_TOTAL_PUBLISHER)
    private readonly dailyTotalPublisher: DailyTotalPublisherPort,
  ) {}

  /**
   * Process a message and increment the appropriate counters
   * @param dto The message data
   * @returns true if the message was processed, false if it was a duplicate
   * @throws DuplicateMessageException if the message is a duplicate
   * @throws MessageProcessingException if there's an error processing the message
   */
  async execute(dto: ProcessMessageDto): Promise<boolean> {
    try {
      this.logger.debug(`Processing message: ${dto.message_id}`);

      // Create domain entities and value objects
      const messageId = new MessageId(dto.message_id);
      const accountId = new AccountId(dto.account_id);
      const createdAt = new Date(dto.created_at);

      // Create metadata object
      const metadata = {
        channel: dto.metadata?.channel || 'unknown',
        source: dto.metadata?.source || 'unknown',
        tags: Array.isArray(dto.metadata?.tags) ? dto.metadata.tags : [],
      };

      // Create the domain message entity
      const message = new Message(messageId, accountId, createdAt, metadata);

      // Add the message to the counter repository
      const result = await this.countsRepository.addMessage(
        message.accountId.toString(),
        message.id.toString(),
        message.createdAt,
      );

      if (!result.processed) {
        this.logger.warn(`Message ${message.id.toString()} is a duplicate`);
        throw new DuplicateMessageException(message.id.toString());
      }

      // Si el mensaje se procesó correctamente y tenemos el total diario,
      // publicar el evento de total diario actualizado
      if (result.dailyTotal !== undefined) {
        this.logger.debug(
          `Publishing daily total update for account ${message.accountId.toString()}: ${result.dailyTotal}`,
        );

        // Publicar el evento (publicación asíncrona, fire-and-forget)
        this.dailyTotalPublisher.publishDailyTotal({
          accountId: message.accountId.toString(),
          date: result.dateKey,
          totalMessages: result.dailyTotal,
          updatedAt: new Date().toISOString(),
        });
      }

      this.logger.debug(
        `Message ${message.id.toString()} processed successfully`,
      );
      return true;
    } catch (error: unknown) {
      if (error instanceof DuplicateMessageException) {
        throw error;
      }

      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Unknown error';

      this.logger.error(`Error processing message: ${errorMessage}`);
      throw new MessageProcessingException(dto.message_id, errorMessage);
    }
  }
}
