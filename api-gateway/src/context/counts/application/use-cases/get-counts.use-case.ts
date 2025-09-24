import { Inject, Injectable } from '@nestjs/common';
import { GetCountsDto } from '../dtos/get-counts.dto';
import { CountsServicePort } from '../../domain/ports/counts-service.port';
import { COUNTS_SERVICE_PORT } from '../../domain/ports/tokens';

/**
 * Caso de uso para obtener conteos de mensajes
 */
@Injectable()
export class GetCountsUseCase {
  constructor(
    @Inject(COUNTS_SERVICE_PORT)
    private readonly countsService: CountsServicePort,
  ) {}

  /**
   * Ejecuta el caso de uso
   * @param dto DTO con los parámetros de consulta
   * @returns Los conteos de mensajes
   */
  async execute(dto: GetCountsDto): Promise<any> {
    return await this.countsService.getCounts(dto.account_id, dto.from, dto.to);
  }
}
