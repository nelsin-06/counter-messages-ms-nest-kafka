import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

/**
 * Gestor de conexión a Redis.
 * Esta clase es responsable únicamente del ciclo de vida de la conexión.
 */
@Injectable()
export class RedisConnection implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisConnection.name);
  private isConnected = false;

  /**
   * Obtiene el cliente Redis. Si no está conectado, lanza una excepción.
   */
  getClient(): RedisClientType {
    if (!this.isConnected) {
      throw new Error('Redis client is not connected');
    }
    return this.client;
  }

  /**
   * Inicializa la conexión cuando el módulo se inicia.
   */
  async onModuleInit() {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://redis:6379',
      });

      this.client.on('error', (err) => {
        this.logger.error('Redis Client Error', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log('Connected to Redis');
      });

      this.client.on('reconnecting', () => {
        this.logger.log('Reconnecting to Redis...');
      });

      await this.client.connect();
      this.isConnected = true;
      this.logger.log('✅ Redis client initialized and connected');
    } catch (error) {
      this.isConnected = false;
      this.logger.error('Failed to connect to Redis', error);
      throw error;
    }
  }

  /**
   * Cierra la conexión cuando el módulo se destruye.
   */
  async onModuleDestroy() {
    try {
      if (this.client && this.isConnected) {
        await this.client.quit();
        this.isConnected = false;
        this.logger.log('Redis connection closed gracefully');
      }
    } catch (error) {
      this.logger.error('Error closing Redis connection', error);
    }
  }
}
