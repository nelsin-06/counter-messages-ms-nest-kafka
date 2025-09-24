import { Module } from '@nestjs/common';
import { GetCountsUseCase } from '../../application/use-cases/get-counts.use-case';
import { COUNTS_SERVICE_PORT } from '../../domain/ports/tokens';
import { KafkaCountsService } from '../kafka/kafka-counts.service';
import { CountsController } from './counts.controller';
import { KafkaModule } from '../../../../transports/transports.module';

@Module({
  imports: [KafkaModule],
  controllers: [CountsController],
  providers: [
    GetCountsUseCase,
    {
      provide: COUNTS_SERVICE_PORT,
      useClass: KafkaCountsService,
    },
  ],
})
export class CountsModule {}
