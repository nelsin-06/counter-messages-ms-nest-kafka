import { Body, Controller, Get } from '@nestjs/common';
import { GetCountsUseCase } from '../../application/use-cases/get-counts.use-case';
import { GetCountsDto } from '../../application/dtos/get-counts.dto';

/**
 * Controlador REST para obtener conteos de mensajes
 */
@Controller('counts')
export class CountsController {
  constructor(private readonly getCountsUseCase: GetCountsUseCase) {}

  /**
   * Endpoint para obtener conteos de mensajes
   * @param getCountsDto DTO con los parámetros de consulta
   * @returns Los conteos de mensajes
   */
  @Get()
  async getCounts(@Body() getCountsDto: GetCountsDto): Promise<any> {
    return await this.getCountsUseCase.execute(getCountsDto);
  }
}
