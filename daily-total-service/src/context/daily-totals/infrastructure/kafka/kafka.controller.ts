import { Controller, Logger } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { ProcessDailyTotalUseCase } from '../../application/use-cases/process-daily-total.use-case';
import { DailyTotalEventDto } from '../../application/dtos/daily-total-event.dto';
import { KafkaOffsetManager } from '../../shared/utils/kafka-offset.utils';

@Controller()
export class DailyTotalKafkaController {
  private readonly logger = new Logger(DailyTotalKafkaController.name);

  constructor(private readonly processDailyTotalUseCase: ProcessDailyTotalUseCase) {}

  @MessagePattern('daily-total-updated')
  async handleDailyTotalEvent(
    @Payload() value: DailyTotalEventDto,
    @Ctx() context: KafkaContext,
  ) {
    // Crear una instancia del administrador de offsets
    const offsetManager = new KafkaOffsetManager(context, 'daily-total-updated');
    
    try {
      // Registrar el payload para diagnóstico
      this.logger.log(`Processing payload: ${JSON.stringify(value)}`);
      
      // Aplicar delay opcional para observar el lag/offset
      const delayMs = Number(process.env.PROCESSING_DELAY_MS || '0');
      if (delayMs > 0) {
        await offsetManager.delay(delayMs);
      }
      
      // Procesar el evento a través del caso de uso
      await this.processDailyTotalUseCase.execute(new DailyTotalEventDto(value));
      
      // Realizar commit manual del offset
      await offsetManager.commitOffset();
      
      return { success: true };
    } catch (error) {
      const msg = (error as any)?.message || 'unknown error';
      const stack = (error as any)?.stack;
      this.logger.error(`Error handling daily total event: ${msg}`, stack);
      
      // Registrar que no se realizó el commit
      offsetManager.logNoCommit();
      
      return { success: false, error: msg };
    }
  }
}