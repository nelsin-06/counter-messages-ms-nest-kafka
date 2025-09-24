/**
 * DTO for getting hourly counts within a date range in application layer
 */
export class GetHourlyCountsRangeDto {
  /**
   * Account identifier
   */
  account_id: string;

  /**
   * Start date and time (ISO8601)
   */
  from: string;

  /**
   * End date and time (ISO8601)
   */
  to: string;

  /**
   * Constructor to initialize the DTO with data
   * @param data Partial data to initialize the DTO
   */
  constructor(data: Partial<GetHourlyCountsRangeDto> = {}) {
    this.account_id = data.account_id || '';
    this.from = data.from || new Date().toISOString();
    this.to = data.to || new Date().toISOString();
  }
}

/**
 * DTO for hourly count item in the response
 */
export class HourlyCountItem {
  /**
   * Account identifier
   */
  account_id: string;

  /**
   * Datetime in ISO8601 format
   */
  datetime: string;

  /**
   * Count of messages for this hour
   */
  count_messages: number;

  constructor(data: Partial<HourlyCountItem> = {}) {
    this.account_id = data.account_id || '';
    this.datetime = data.datetime || '';
    this.count_messages = data.count_messages || 0;
  }
}
