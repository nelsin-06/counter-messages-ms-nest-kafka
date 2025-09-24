import { Inject, Injectable, Logger } from '@nestjs/common';
import { CountsRepository } from '../../domain/repositories/counts.repository';
import { RedisPort } from '../../domain/ports/redis.port';
import { REDIS_PORT } from '../config/services';

@Injectable()
export class RedisCountsRepository implements CountsRepository {
  private readonly logger = new Logger(RedisCountsRepository.name);

  constructor(@Inject(REDIS_PORT) private readonly redisClient: RedisPort) {}

  async addMessage(
    accountId: string,
    messageId: string,
    createdAt: Date,
  ): Promise<{ processed: boolean; dateKey: string; dailyTotal?: number }> {
    const dateKey = createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
    const hour = createdAt.getUTCHours().toString();

    // 1. Verificar si el mensaje existe en el conjunto global
    const existsGlobally = await this.redisClient.sismember(
      `account:${accountId}:messages:global`,
      messageId,
    );

    if (existsGlobally === 1) {
      this.logger.debug(`Message ${messageId} is a duplicate (global check)`);
      return { processed: false, dateKey };
    }

    // 2. Idempotencia: messageId en un set diario (por compatibilidad con el sistema existente)
    const wasAdded = await this.redisClient.sadd(
      `account:${accountId}:messages:${dateKey}`,
      messageId,
    );

    if (wasAdded === 0) {
      this.logger.debug(`Message ${messageId} is a duplicate (daily check)`);
      return { processed: false, dateKey };
    }

    // 3. Agregar el mensaje al conjunto global para idempotencia permanente
    await this.redisClient.sadd(
      `account:${accountId}:messages:global`,
      messageId,
    );

    // 4. Incrementar contador por hora
    await this.redisClient.hincrby(
      `account:${accountId}:hourly:${dateKey}`,
      hour,
      1,
    );

    // 5. Incrementar contador diario y obtener el total actualizado
    const dailyTotal = await this.redisClient.incr(
      `account:${accountId}:daily:${dateKey}`,
    );

    return { processed: true, dateKey, dailyTotal };
  }

  async getHourlyCounts(
    accountId: string,
    date: string,
  ): Promise<Record<string, number>> {
    const result = await this.redisClient.hgetall(
      `account:${accountId}:hourly:${date}`,
    );
    // Convertir los valores de string → number
    return Object.fromEntries(
      Object.entries(result).map(([h, v]) => [h, Number(v)]),
    );
  }

  async getDailyTotal(accountId: string, date: string): Promise<number> {
    const total = await this.redisClient.get(
      `account:${accountId}:daily:${date}`,
    );
    return total ? Number(total) : 0;
  }

  /**
   * Obtiene los conteos por hora dentro de un rango de fechas
   *
   * La estructura de datos en Redis usa las claves:
   * - account:{accountId}:hourly:{YYYY-MM-DD} -> hash con {hora: conteo}
   *
   * Este método extrae los conteos para cada día dentro del rango
   * y convierte los resultados al formato requerido.
   */
  async getHourlyCountsRange(
    accountId: string,
    fromDate: string,
    toDate: string,
  ): Promise<Array<{ datetime: string; count: number }>> {
    try {
      // Parsear las fechas de inicio y fin
      const fromDateTime = new Date(fromDate);
      const toDateTime = new Date(toDate);

      // Validar fechas
      if (isNaN(fromDateTime.getTime()) || isNaN(toDateTime.getTime())) {
        throw new Error('Invalid date format');
      }

      // Array para almacenar los resultados
      const results: Array<{ datetime: string; count: number }> = [];

      // Recorrer días entre las fechas
      const currentDate = new Date(fromDateTime);
      currentDate.setUTCHours(0, 0, 0, 0);

      while (currentDate <= toDateTime) {
        const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD

        // Obtener conteos para este día
        const hourlyCounts = await this.getHourlyCounts(accountId, dateString);

        // Filtrar horas que están dentro del rango
        Object.entries(hourlyCounts).forEach(([hour, count]) => {
          const hourNumber = parseInt(hour, 10);
          const hourDateTime = new Date(dateString);
          hourDateTime.setUTCHours(hourNumber, 0, 0, 0);

          // Solo incluir si está dentro del rango
          if (hourDateTime >= fromDateTime && hourDateTime <= toDateTime) {
            results.push({
              datetime: hourDateTime.toISOString(),
              count,
            });
          }
        });

        // Avanzar al siguiente día
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Ordenar los resultados por fecha
      return results.sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      );
    } catch (error) {
      this.logger.error(`Error getting hourly counts range: ${error.message}`);
      return [];
    }
  }
}
