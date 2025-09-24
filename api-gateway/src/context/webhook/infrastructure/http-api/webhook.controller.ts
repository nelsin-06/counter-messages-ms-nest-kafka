import { Body, Controller, Post } from '@nestjs/common';
import { WebhookRequestDto } from '../../application/dtos/webhook-request.dto';
import { ProcessWebhookUseCase } from '../../application/use-cases/process-webhook.use-case';

/**
 * Controlador para el endpoint de webhook
 */
@Controller('webhook')
export class WebhookController {
  constructor(private readonly processWebhookUseCase: ProcessWebhookUseCase) {}

  /**
   * Endpoint para recibir mensajes de webhook
   * @param body Cuerpo de la petición con campos obligatorios:
   *             - message_id: ID único del mensaje
   *             - account_id: ID de la cuenta
   *             - created_at: Fecha de creación en formato ISO8601
   *             - Acepta cualquier propiedad adicional que será procesada y enviada a Kafka
   * @returns Confirmación del procesamiento
   */
  @Post('message')
  async receiveWebhook(
    @Body() body: WebhookRequestDto,
  ): Promise<{ success: boolean; message: string; messageId: string }> {
    await this.processWebhookUseCase.execute(body);

    return {
      success: true,
      message: 'Message successfully processed and sent to Kafka',
      messageId: body.message_id,
    };
  }
}
