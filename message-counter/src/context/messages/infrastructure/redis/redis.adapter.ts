import { Injectable, Logger } from '@nestjs/common';
import { RedisPort } from '../../domain/ports/redis.port';
import { RedisConnection } from './redis.connection';

/**
 * Adaptador de Redis que implementa el puerto.
 * Esta clase es responsable únicamente de implementar las operaciones definidas en RedisPort.
 */
@Injectable()
export class RedisAdapter implements RedisPort {
  private readonly logger = new Logger(RedisAdapter.name);

  constructor(private readonly redisConnection: RedisConnection) {}

  /**
   * Acceder al cliente Redis mediante la conexión.
   */
  private get client() {
    return this.redisConnection.getClient();
  }

  // -------------------------
  // Low-level Redis operations implementation (RedisPort)
  // -------------------------
  async sadd(key: string, value: string): Promise<number> {
    try {
      return await this.client.sAdd(key, value);
    } catch (error) {
      this.logger.error(`Error in sadd operation for key ${key}`, error);
      throw error;
    }
  }

  async hincrby(
    key: string,
    field: string,
    increment: number,
  ): Promise<number> {
    try {
      return await this.client.hIncrBy(key, field, increment);
    } catch (error) {
      this.logger.error(
        `Error in hincrby operation for key ${key}, field ${field}`,
        error,
      );
      throw error;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      this.logger.error(`Error in incr operation for key ${key}`, error);
      throw error;
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      return await this.client.hGetAll(key);
    } catch (error) {
      this.logger.error(`Error in hgetall operation for key ${key}`, error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Error in get operation for key ${key}`, error);
      throw error;
    }
  }

  async sismember(key: string, member: string): Promise<number> {
    try {
      return await this.client.sIsMember(key, member);
    } catch (error) {
      this.logger.error(
        `Error in sismember operation for key ${key}, member ${member}`,
        error,
      );
      throw error;
    }
  }
}
