export class DailyTotalEventDto {
  constructor(data: Partial<DailyTotalEventDto>) {
    Object.assign(this, data);
  }
  
  readonly event: string;
  readonly version: number;
  readonly account_id: string;
  readonly date: string;
  readonly total_messages: number;
  readonly updated_at: string;
  readonly source: string;
}