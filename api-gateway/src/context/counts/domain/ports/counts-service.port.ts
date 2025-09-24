/**
 * Puerto (interfaz) para obtener conteos de mensajes
 */
export interface CountsServicePort {
  /**
   * Obtiene los conteos de mensajes para una cuenta y rango de fechas
   * @param accountId ID de la cuenta
   * @param from Fecha de inicio (formato ISO8601)
   * @param to Fecha de fin (formato ISO8601)
   */
  getCounts(accountId: string, from: string, to: string): Promise<any>;
}
