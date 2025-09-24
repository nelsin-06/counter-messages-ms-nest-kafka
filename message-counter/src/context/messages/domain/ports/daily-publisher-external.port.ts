export interface DailyTotalPublisherPort {
  publishDailyTotal(event: {
    accountId: string;
    date: string; // YYYY-MM-DD
    totalMessages: number;
    updatedAt: string; // ISO8601
  }): void;
}
