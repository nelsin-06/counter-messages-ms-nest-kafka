/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, IsISO8601 } from 'class-validator';
import { WebhookMessage } from '../../domain/ports/webhook-processor.port';

/**
 * DTO para la solicitud del webhook
 * Validamos los campos obligatorios para el webhook
 */
export class WebhookRequestDto implements WebhookMessage {
  /**
   * ID único del mensaje
   */
  @IsString()
  @IsNotEmpty()
  message_id!: string;

  /**
   * ID de la cuenta
   */
  @IsString()
  @IsNotEmpty()
  account_id!: string;

  /**
   * Fecha de creación del mensaje en formato ISO8601
   */
  @IsISO8601()
  @IsNotEmpty()
  created_at!: string;

  /**
   * Campos adicionales del mensaje
   * Permite cualquier propiedad adicional además de las obligatorias
   * Estas propiedades serán preservadas y enviadas a Kafka
   */
  [key: string]: any;
}
