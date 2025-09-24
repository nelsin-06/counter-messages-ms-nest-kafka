/**
 * Puerto que define las operaciones de Redis necesarias para la aplicación.
 * El dominio solo conoce esta interfaz, no los detalles de implementación.
 */
export interface RedisPort {
  sadd(key: string, value: string): Promise<number>;
  hincrby(key: string, field: string, increment: number): Promise<number>;
  incr(key: string): Promise<number>;
  hgetall(key: string): Promise<Record<string, string>>;
  get(key: string): Promise<string | null>;
  sismember(key: string, member: string): Promise<number>;
}
