/**
 * Interfaz para el mensaje de webhook
 */
export interface WebhookMessage {
  message_id: string;
  account_id: string;
  created_at: string;
  [key: string]: any;
}

/**
 * Puerto (interfaz) para procesar mensajes de webhook
 */
export interface WebhookProcessorPort {
  /**
   * Procesa un mensaje de webhook
   * @param message El mensaje a procesar
   */
  process(message: WebhookMessage): Promise<void>;
}
