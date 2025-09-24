import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  WebhookMessage,
  WebhookProcessorPort,
} from '../../domain/ports/webhook-processor.port';
import { KAFKA_SERVICE } from '../../../../config/services';

/**
 * Adaptador para procesar mensajes de webhook utilizando Kafka
 */
@Injectable()
export class KafkaWebhookProcessor
  implements WebhookProcessorPort, OnModuleInit
{
  private readonly logger = new Logger(KafkaWebhookProcessor.name);

  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  onModuleInit() {
    // Asegurarse de que el cliente Kafka esté conectado al iniciar el módulo

    this.kafkaClient.connect();
  }

  /**
   * Procesa un mensaje de webhook enviándolo a Kafka
   * @param message El mensaje a procesar con campos obligatorios:
   *                - message_id: ID único del mensaje
   *                - account_id: ID de la cuenta
   *                - created_at: Fecha de creación en formato ISO8601
   *                Puede incluir cualquier propiedad adicional que será enviada a Kafka
   */
  process(message: WebhookMessage): Promise<void> {
    try {
      this.logger.log(
        `Processing webhook message: ${message.message_id} from account: ${message.account_id}`,
      );

      // Validar que los campos obligatorios existan
      if (!message.message_id || !message.account_id || !message.created_at) {
        throw new Error('Missing required fields in message');
      }

      // Emitir el mensaje a Kafka
      this.kafkaClient.emit('new-message', message);

      this.logger.log(`Webhook message ${message.message_id} sent to Kafka`);

      // Devolver una promesa resuelta (no hay operación asíncrona real aquí)
      return Promise.resolve();
    } catch (error) {
      this.logger.error(
        `Error processing webhook message: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      return Promise.reject(new Error('Failed to process webhook message'));
    }
  }
}
