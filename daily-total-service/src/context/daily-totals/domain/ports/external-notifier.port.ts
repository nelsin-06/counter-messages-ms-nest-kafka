export interface ExternalNotifierPort {
  notifyDailyTotal(data: {
    account_id: string;
    date: string;
    total_messages: number;
    updated_at: string;
  }): Promise<void>;
}