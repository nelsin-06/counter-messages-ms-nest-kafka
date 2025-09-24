/**
 * DTO for posting daily total in application layer
 * This DTO is used to pass data to the post daily total use case
 */
export class PostDailyTotalDto {
  /**
   * Account identifier
   */
  account_id: string;

  /**
   * Date to get total for (YYYY-MM-DD)
   */
  date: string;

  /**
   * Constructor to initialize the DTO with data
   * @param data Partial data to initialize the DTO
   */
  constructor(data: Partial<PostDailyTotalDto> = {}) {
    this.account_id = data.account_id || '';
    this.date = data.date || new Date().toISOString().split('T')[0];
  }
}

/**
 * Response DTO for daily total
 */
export class PostDailyTotalResponseDto {
  /**
   * Account identifier
   */
  account_id: string;

  /**
   * Date of the count (YYYY-MM-DD)
   */
  date: string;

  /**
   * Total count for the day
   */
  total_count: number;

  /**
   * Constructor to initialize the response DTO
   * @param data Partial data to initialize the DTO
   */
  constructor(data: Partial<PostDailyTotalResponseDto> = {}) {
    this.account_id = data.account_id || '';
    this.date = data.date || '';
    this.total_count = data.total_count || 0;
  }
}
