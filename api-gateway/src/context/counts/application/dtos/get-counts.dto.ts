/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para solicitar los conteos de mensajes
 */
export class GetCountsDto {
  @IsString()
  @IsNotEmpty({ message: 'account_id is required' })
  account_id: string;

  @IsString()
  @IsNotEmpty({ message: 'from date is required' })
  @Type(() => String)
  from: string;

  @IsString()
  @IsNotEmpty({ message: 'to date is required' })
  @Type(() => String)
  to: string;
}
