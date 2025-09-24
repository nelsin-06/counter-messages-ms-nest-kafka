import { AccountId } from '../value-objects/account-id.vo';
import { MessageId } from '../value-objects/message-id.vo';

/**
 * Interface representing message metadata
 */
export interface MessageMetadata {
  channel: string;
  source: string;
  tags: string[];
  [key: string]: unknown; // Allow additional metadata properties
}

/**
 * Interface for raw message data
 */
export interface MessageProps {
  message_id: string;
  account_id: string;
  created_at: string;
  metadata?: {
    channel?: string;
    source?: string;
    tags?: string[];
    [key: string]: unknown;
  };
}

/**
 * Message Entity in the Domain
 * Represents a message in the system with all its properties and behaviors
 */
export class Message {
  private readonly _id: MessageId;
  private readonly _accountId: AccountId;
  private readonly _createdAt: Date;
  private readonly _metadata: MessageMetadata;

  /**
   * Constructor for creating a Message entity
   * @param id The message identifier
   * @param accountId The account identifier
   * @param createdAt The creation timestamp
   * @param metadata Additional metadata about the message
   */
  constructor(
    id: MessageId,
    accountId: AccountId,
    createdAt: Date,
    metadata: MessageMetadata,
  ) {
    this._id = id;
    this._accountId = accountId;
    this._createdAt = createdAt;
    this._metadata = { ...metadata };
  }

  /**
   * Get the message ID
   */
  get id(): MessageId {
    return this._id;
  }

  /**
   * Get the account ID
   */
  get accountId(): AccountId {
    return this._accountId;
  }

  /**
   * Get the creation timestamp
   */
  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  /**
   * Get the message metadata
   */
  get metadata(): MessageMetadata {
    return { ...this._metadata };
  }

  /**
   * Get the channel from metadata
   */
  get channel(): string {
    return this._metadata.channel;
  }

  /**
   * Get the source from metadata
   */
  get source(): string {
    return this._metadata.source;
  }

  /**
   * Get the tags from metadata
   */
  get tags(): string[] {
    return [...this._metadata.tags];
  }

  /**
   * Check if the message has a specific tag
   * @param tag The tag to check for
   * @returns True if the tag exists
   */
  hasTag(tag: string): boolean {
    return this._metadata.tags.includes(tag);
  }

  /**
   * Factory method to create a Message from raw data
   * @param data Raw message data
   * @returns Message entity
   */
  static create(data: MessageProps): Message {
    const messageId = new MessageId(data.message_id);
    const accountId = new AccountId(data.account_id);
    const createdAt = new Date(data.created_at);

    // Create a properly formatted metadata object
    const metadata: MessageMetadata = {
      channel: data.metadata?.channel || 'unknown',
      source: data.metadata?.source || 'unknown',
      tags: Array.isArray(data.metadata?.tags) ? data.metadata.tags : [],
    };

    // Copy any additional properties
    if (data.metadata) {
      Object.keys(data.metadata).forEach((key) => {
        if (!['channel', 'source', 'tags'].includes(key) && data.metadata) {
          metadata[key] = data.metadata[key];
        }
      });
    }

    return new Message(messageId, accountId, createdAt, metadata);
  }

  /**
   * Convert Message entity to a plain object
   * @returns Plain object representation of the message
   */
  toObject() {
    return {
      message_id: this._id.toString(),
      account_id: this._accountId.toString(),
      created_at: this._createdAt.toISOString(),
      metadata: { ...this._metadata },
    };
  }
}
