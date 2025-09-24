/**
 * Exception thrown when a duplicate message is detected
 */
export class DuplicateMessageException extends Error {
  /**
   * Constructor
   * @param messageId The ID of the duplicate message
   */
  constructor(messageId: string) {
    super(`Duplicate message detected: ${messageId}`);
    this.name = 'DuplicateMessageException';
  }
}
