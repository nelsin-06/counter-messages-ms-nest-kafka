import { Injectable, Logger } from '@nestjs/common';
import {
  PostDailyTotalDto,
  PostDailyTotalResponseDto,
} from '../dtos/post-daily-total.dto';
import { CountsRepository } from '../../domain/repositories/counts.repository';
import { AccountId } from '../../domain/value-objects/account-id.vo';

@Injectable()
export class PostDailyTotalUseCase {
  private readonly logger = new Logger(PostDailyTotalUseCase.name);

  constructor(private readonly countsRepository: CountsRepository) {}

  /**
   * Get daily total count for a specific account and date
   * @param dto The request data with account_id and date
   * @returns Response with total count
   */
  async execute(dto: PostDailyTotalDto): Promise<PostDailyTotalResponseDto> {
    try {
      // Validate account ID
      const accountId = new AccountId(dto.account_id);

      // Get daily total from repository
      const totalCount = await this.countsRepository.getDailyTotal(
        accountId.toString(),
        dto.date,
      );

      // Return response DTO
      return new PostDailyTotalResponseDto({
        account_id: accountId.toString(),
        date: dto.date,
        total_count: totalCount,
      });
    } catch (error: unknown) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Unknown error';

      this.logger.error(
        `Error getting daily total for account ${dto.account_id}: ${errorMessage}`,
      );

      throw new Error(`Failed to get daily total: ${errorMessage}`);
    }
  }
}
