import { Logger } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';

/**
 * Clase de utilidad para manejar offsets de Kafka
 * Encapsula la lógica común de obtención de información del mensaje
 * y el commit manual de offsets
 */
export class KafkaOffsetManager {
  private readonly logger = new Logger(KafkaOffsetManager.name);
  private topic: string;
  private partition: number;
  private offset: string;
  private key?: string;
  private consumer: any; // Necesario mantener como 'any' debido a la API de NestJS Kafka

  /**
   * Método estático para extraer un valor seguro de un mensaje potencialmente 'any'
   * @param message El mensaje del que extraer el valor
   * @param key La clave a extraer
   * @param defaultValue Valor por defecto si no existe
   * @returns El valor extraído o el valor por defecto
   */
  static extractSafeValue(
    message: any,
    key: string,
    defaultValue: any = null,
  ): any {
    if (message && typeof message === 'object' && key in message) {
      return message[key];
    }
    return defaultValue;
  }

  /**
   * Constructor que extrae la información de contexto de Kafka
   * @param context El contexto de Kafka proporcionado por NestJS
   * @param operationName Nombre de la operación para logging
   */
  constructor(
    private readonly context: KafkaContext,
    private readonly operationName: string,
  ) {
    this.extractContextInfo();
  }

  /**
   * Extrae información relevante del contexto de Kafka
   * @private
   */
  private extractContextInfo(): void {
    this.topic = this.context.getTopic();
    this.partition = this.context.getPartition();
    const raw = this.context.getMessage();
    this.offset = raw?.offset;
    this.key = raw?.key?.toString?.();
    this.consumer = this.context.getConsumer();

    this.logger.log(
      `Received ${this.operationName} message: topic=${this.topic} partition=${this.partition} offset=${this.offset} key=${this.key}`,
    );
  }

  /**
   * Realiza un commit manual del offset actual
   * @returns Promise<void>
   */
  public async commitOffset(): Promise<void> {
    try {
      // El offset a confirmar es el offset actual + 1
      const nextOffset = (Number(this.offset) + 1).toString();

      // Estructura para el commit
      const offsetData = [
        {
          topic: this.topic,
          partition: this.partition,
          offset: nextOffset,
        },
      ];

      // Realizar el commit
      await this.consumer.commitOffsets(offsetData);
      this.logger.log(
        `✅ Manually committed offset ${nextOffset} for topic=${this.topic} partition=${this.partition}`,
      );

      return;
    } catch (error) {
      this.logger.error(
        `Error committing offset for ${this.operationName}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Registra que no se realizó un commit debido a un error
   */
  public logNoCommit(): void {
    this.logger.warn(
      `❌ No offset committed for ${this.operationName} due to processing error. Message will be redelivered.`,
    );
  }

  /**
   * Obtiene información del mensaje para logging
   * @returns Un string formateado con la información del mensaje
   */
  public getMessageInfo(): string {
    return `topic=${this.topic} partition=${this.partition} offset=${this.offset} key=${this.key}`;
  }

  /**
   * Obtiene el mensaje completo del contexto
   * @returns El mensaje del contexto
   */
  public getMessage(): any {
    return this.context.getMessage();
  }

  /**
   * Método para introducir un retraso artificial en el procesamiento
   * Útil para pruebas y depuración de offsets y lag de consumidores
   * @param ms Tiempo de retraso en milisegundos
   */
  public async delay(ms: number): Promise<void> {
    this.logger.log(`Delaying processing by ${ms} ms`);
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
