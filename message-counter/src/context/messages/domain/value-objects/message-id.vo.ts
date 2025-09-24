/**
 * Value Object for Message ID
 * Encapsulates the validation and handling of message identifiers
 */
export class MessageId {
  private readonly value: string;

  constructor(value: string) {
    this.validateMessageId(value);
    this.value = value;
  }

  /**
   * Validates the format of a message ID
   * @param id The message ID to validate
   * @throws Error if the message ID format is invalid
   */
  private validateMessageId(id: string): void {
    if (!id) {
      throw new Error('Message ID cannot be empty');
    }

    if (!id.startsWith('msg_') || id.length < 5) {
      throw new Error(
        'Invalid message ID format. Should start with "msg_" and have at least 5 characters',
      );
    }
  }

  /**
   * Returns the string value of the message ID
   */
  toString(): string {
    return this.value;
  }

  /**
   * Returns the primitive value of the message ID
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compares two MessageId objects for equality
   * @param other Another MessageId object
   */
  equals(other: MessageId): boolean {
    return this.value === other.value;
  }

  /**
   * Factory method to create a MessageId from a string
   * @param value The string value to create a MessageId from
   */
  static create(value: string): MessageId {
    return new MessageId(value);
  }
}
