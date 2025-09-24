/**
 * Exception thrown when there's an error processing a message
 */
export class MessageProcessingException extends Error {
  /**
   * Constructor
   * @param messageId The ID of the message that failed to process
   * @param reason The reason for the failure
   */
  constructor(messageId: string, reason: string) {
    super(`Error processing message ${messageId}: ${reason}`);
    this.name = 'MessageProcessingException';
  }
}
