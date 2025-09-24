import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  GetHourlyCountsRangeDto,
  HourlyCountItem,
} from '../dtos/get-hourly-counts-range.dto';
import { CountsRepository } from '../../domain/repositories/counts.repository';
import { AccountId } from '../../domain/value-objects/account-id.vo';
import { COUNTS_REPOSITORY } from '../../infrastructure/config/services';

@Injectable()
export class GetHourlyCountsRangeUseCase {
  private readonly logger = new Logger(GetHourlyCountsRangeUseCase.name);

  constructor(
    @Inject(COUNTS_REPOSITORY)
    private readonly countsRepository: CountsRepository,
  ) {}

  /**
   * Get hourly counts for a specific account within a date range
   * @param dto The request data with account_id, from and to dates
   * @returns Array of hourly counts
   */
  async execute(dto: GetHourlyCountsRangeDto): Promise<HourlyCountItem[]> {
    try {
      // Validate account ID
      const accountId = new AccountId(dto.account_id);

      // Get hourly counts from repository
      const hourlyCounts = await this.countsRepository.getHourlyCountsRange(
        accountId.toString(),
        dto.from,
        dto.to,
      );

      // Map to response format
      return hourlyCounts.map(
        (item) =>
          new HourlyCountItem({
            account_id: accountId.toString(),
            datetime: item.datetime,
            count_messages: item.count,
          }),
      );
    } catch (error: unknown) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Unknown error';

      this.logger.error(
        `Error getting hourly counts range for account ${dto.account_id}: ${errorMessage}`,
      );

      throw new Error(`Failed to get hourly counts range: ${errorMessage}`);
    }
  }
}
