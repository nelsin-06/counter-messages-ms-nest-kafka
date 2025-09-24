import { Injectable, Logger } from '@nestjs/common';
import { ExternalNotifierPort } from '../../domain/ports/external-notifier.port';
import axios from 'axios';

@Injectable()
export class HttpExternalNotifierAdapter implements ExternalNotifierPort {
  private readonly logger = new Logger(HttpExternalNotifierAdapter.name);
  private readonly externalApiUrl =
    process.env.EXTERNAL_API_URL || 'http://external-api:3005/daily-total';

  async notifyDailyTotal(data: {
    account_id: string;
    date: string;
    total_messages: number;
    updated_at: string;
  }): Promise<void> {
    try {
      this.logger.log(
        `Sending daily total to external API: ${JSON.stringify(data)}`,
      );

      // Mock del POST a la API externa
      // En producción, esto haría una petición HTTP real
      this.logger.log(
        `[MOCK] POST to ${this.externalApiUrl} with payload: ${JSON.stringify(data)}`,
      );
      console.log(
        '🚀 ~ HttpExternalNotifierAdapter ~ notifyDailyTotal ~ data:',
        data,
      );

      // Simulamos un pequeño retraso para imitar una petición real
      await new Promise((resolve) => setTimeout(resolve, Number(100)));

      // Descomenta esta línea para hacer una petición real a través de axios
      // await axios.post(this.externalApiUrl, data);

      this.logger.log(`[MOCK] External API responded: { status: 'ok' }`);
    } catch (error) {
      this.logger.error(
        `Error sending daily total to external API: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to notify external service: ${error.message}`);
    }
  }
}
