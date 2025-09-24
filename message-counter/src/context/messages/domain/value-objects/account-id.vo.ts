/**
 * Value Object for Account ID
 * Encapsulates the validation and handling of account identifiers
 */
export class AccountId {
  private readonly value: string;

  constructor(value: string) {
    this.validateAccountId(value);
    this.value = value;
  }

  /**
   * Validates the format of an account ID
   * @param id The account ID to validate
   * @throws Error if the account ID format is invalid
   */
  private validateAccountId(id: string): void {
    if (!id) {
      throw new Error('Account ID cannot be empty');
    }

    if (!id.startsWith('acc_') || id.length < 5) {
      throw new Error(
        'Invalid account ID format. Should start with "acc_" and have at least 5 characters',
      );
    }
  }

  /**
   * Returns the string value of the account ID
   */
  toString(): string {
    return this.value;
  }

  /**
   * Returns the primitive value of the account ID
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compares two AccountId objects for equality
   * @param other Another AccountId object
   */
  equals(other: AccountId): boolean {
    return this.value === other.value;
  }

  /**
   * Factory method to create an AccountId from a string
   * @param value The string value to create an AccountId from
   */
  static create(value: string): AccountId {
    return new AccountId(value);
  }
}
