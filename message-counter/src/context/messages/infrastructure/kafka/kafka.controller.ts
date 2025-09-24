import { Controller, Inject, Logger } from '@nestjs/common';
import {
  ClientKafka,
  MessagePattern,
  Payload,
  Ctx,
  KafkaContext,
} from '@nestjs/microservices';
import { KAFKA_SERVICE } from '../config/services';
import { MessageDto } from './kafka.event.dto';
import { ProcessMessageUseCase } from '../../application/use-cases/process-message.use-case';
import { ProcessMessageDto } from '../../application/dtos/process-message.dto';
import { GetHourlyCountsRangeUseCase } from '../../application/use-cases/get-hourly-counts-range.use-case';
import { GetHourlyCountsRangeDto } from '../../application/dtos/get-hourly-counts-range.dto';
import { KafkaOffsetManager } from '../../shared/utils/kafka-offset.utils';

@Controller()
export class KafkaController {
  private readonly logger = new Logger(KafkaController.name);

  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly processMessageUseCase: ProcessMessageUseCase,
    private readonly getHourlyCountsRangeUseCase: GetHourlyCountsRangeUseCase,
  ) {}

  @MessagePattern('new-message')
  async handleMessage(
    @Payload() message: MessageDto,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    // Crear una instancia del administrador de offsets
    const offsetManager = new KafkaOffsetManager(context, 'new-message');

    try {
      // Procesar el mensaje
      await this.processMessageUseCase.execute(
        new ProcessMessageDto({
          ...message,
          metadata: {
            channel: message.metadata?.channel,
            source: message.metadata?.source,
            tags: message.metadata?.tags,
          },
        }),
      );

      // Realizar commit del offset
      await offsetManager.commitOffset();
    } catch (error) {
      this.logger.error(
        `Error processing message`,
        error instanceof Error ? error.stack : String(error),
      );
      // Registrar que no se realizó el commit
      offsetManager.logNoCommit();
    }
  }

  @MessagePattern('get-counts')
  async handleGetMessage(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    // Crear una instancia del administrador de offsets
    const offsetManager = new KafkaOffsetManager(context, 'get-counts');

    try {
      this.logger.log(
        `Received get-counts request: ${JSON.stringify(message)}`,
      );

      // Procesar el mensaje
      let data;

      // Si es un rango de fechas (tiene from y to)
      if (
        message &&
        typeof message === 'object' &&
        'from' in message &&
        'to' in message
      ) {
        data = await this.getHourlyCountsRangeUseCase.execute(
          new GetHourlyCountsRangeDto({
            account_id: String(
              KafkaOffsetManager.extractSafeValue(message, 'account_id', ''),
            ),
            from: String(
              KafkaOffsetManager.extractSafeValue(message, 'from', ''),
            ),
            to: String(KafkaOffsetManager.extractSafeValue(message, 'to', '')),
          }),
        );
      }
      // Si no hay fechas válidas
      else {
        throw new Error(
          'Invalid request: missing date or date range parameters',
        );
      }

      // Realizar commit del offset
      await offsetManager.commitOffset();

      return data;
    } catch (error) {
      this.logger.error(
        `Error processing get-counts message`,
        error instanceof Error ? error.stack : String(error),
      );
      // Registrar que no se realizó el commit
      offsetManager.logNoCommit();
      throw error; // Re-lanzar el error para que el cliente lo reciba
    }
  }
}
