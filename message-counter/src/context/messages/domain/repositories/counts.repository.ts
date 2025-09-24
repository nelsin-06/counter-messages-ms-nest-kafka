export interface CountsRepository {
  /**
   * Agrega un mensaje al contador.
   * Debe garantizar idempotencia (no contar dos veces el mismo messageId).
   *
   * @param accountId Cuenta a la que pertenece el mensaje
   * @param messageId Identificador único del mensaje
   * @param createdAt Fecha de creación del mensaje
   * @returns Objeto con información sobre el resultado del procesamiento:
   *          - processed: indica si el mensaje fue procesado o era un duplicado
   *          - dateKey: la clave de fecha (YYYY-MM-DD) del mensaje
   *          - dailyTotal: el total diario actualizado (solo si processed=true)
   */
  addMessage(
    accountId: string,
    messageId: string,
    createdAt: Date,
  ): Promise<{ processed: boolean; dateKey: string; dailyTotal?: number }>;

  /**
   * Devuelve los conteos por hora de una cuenta en un día específico.
   *
   * @param accountId Cuenta a consultar
   * @param date Fecha (YYYY-MM-DD)
   * @returns Diccionario {hora: count}
   */
  getHourlyCounts(
    accountId: string,
    date: string,
  ): Promise<Record<string, number>>;

  /**
   * Devuelve el total diario de mensajes de una cuenta.
   *
   * @param accountId Cuenta a consultar
   * @param date Fecha (YYYY-MM-DD)
   * @returns Total de mensajes en ese día
   */
  getDailyTotal(accountId: string, date: string): Promise<number>;

  /**
   * Devuelve los conteos por hora dentro de un rango de fechas.
   *
   * @param accountId Cuenta a consultar
   * @param fromDate Fecha de inicio (ISO8601)
   * @param toDate Fecha de fin (ISO8601)
   * @returns Array de objetos con datetime y conteo de mensajes
   */
  getHourlyCountsRange(
    accountId: string,
    fromDate: string,
    toDate: string,
  ): Promise<Array<{ datetime: string; count: number }>>;
}
