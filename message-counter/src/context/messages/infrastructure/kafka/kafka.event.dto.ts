import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Message metadata DTO with validation
 */
export class MessageMetadataDto {
  @IsString()
  @IsOptional()
  channel: string = 'unknown';

  @IsString()
  @IsOptional()
  source: string = 'unknown';

  @IsArray()
  @IsOptional()
  tags: string[] = [];
}

/**
 * Kafka message DTO with validation decorators
 */
export class MessageDto {
  /**
   * Message identifier
   */
  @IsString()
  @IsOptional()
  message_id: string;

  /**
   * Account identifier
   */
  @IsString()
  @IsOptional()
  account_id: string;

  /**
   * Timestamp of when the message was created (ISO format)
   */
  @IsISO8601()
  @IsOptional()
  created_at: string;

  /**
   * Additional metadata
   */
  @ValidateNested()
  @IsOptional()
  @Type(() => MessageMetadataDto)
  metadata: MessageMetadataDto = new MessageMetadataDto();

  /**
   * Constructor with default values for cleaner instantiation
   */
  constructor(partial: Partial<MessageDto> = {}) {
    this.message_id = partial.message_id || '';
    this.account_id = partial.account_id || '';
    this.created_at = partial.created_at || new Date().toISOString();

    // Initialize metadata with defaults and any provided values
    this.metadata = new MessageMetadataDto();
    if (partial.metadata) {
      this.metadata.channel = partial.metadata.channel || this.metadata.channel;
      this.metadata.source = partial.metadata.source || this.metadata.source;
      this.metadata.tags = partial.metadata.tags || this.metadata.tags;
    }
  }
}
