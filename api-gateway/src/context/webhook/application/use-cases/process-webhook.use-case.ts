import { Inject, Injectable } from '@nestjs/common';
import { WebhookRequestDto } from '../dtos/webhook-request.dto';
import { WebhookProcessorPort } from '../../domain/ports/webhook-processor.port';
import { WEBHOOK_PROCESSOR_PORT } from '../../domain/ports/tokens';

/**
 * Caso de uso para procesar mensajes de webhook
 */
@Injectable()
export class ProcessWebhookUseCase {
  constructor(
    @Inject(WEBHOOK_PROCESSOR_PORT)
    private readonly webhookProcessor: WebhookProcessorPort,
  ) {}

  /**
   * Ejecuta el caso de uso
   * @param dto DTO con los datos del webhook
   */
  async execute(dto: WebhookRequestDto): Promise<void> {
    // El DTO ya está validado por el ValidationPipe global, así que podemos
    // enviarlo directamente al procesador como un WebhookMessage
    await this.webhookProcessor.process(dto);
  }
}
