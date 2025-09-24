/**
 * DTO for processing messages in application layer
 * This DTO is used to pass data to the process message use case
 */
export class ProcessMessageDto {
  /**
   * Message identifier
   */
  message_id: string;

  /**
   * Account identifier
   */
  account_id: string;

  /**
   * Timestamp of when the message was created
   */
  created_at: string;

  /**
   * Additional metadata
   */
  metadata?: {
    channel?: string;
    source?: string;
    tags?: string[];
    [key: string]: unknown;
  };

  /**
   * Constructor to initialize the DTO with data
   * @param data Partial data to initialize the DTO
   */
  constructor(data: Partial<ProcessMessageDto> = {}) {
    this.message_id = data.message_id || '';
    this.account_id = data.account_id || '';
    this.created_at = data.created_at || new Date().toISOString();
    this.metadata = data.metadata ? { ...data.metadata } : undefined;
  }
}
