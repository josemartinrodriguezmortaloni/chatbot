// src/agents/chat/entities/message.entity.ts
import { MessageRole } from '../dto/message.dto';

/**
 * Entidad de mensaje para persistencia en base de datos.
 * Representa un mensaje individual en una conversación.
 */
export class MessageEntity {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    conversationId: string,
    role: MessageRole,
    content: string,
    metadata?: Record<string, any>,
  ) {
    this.id = this.generateId();
    this.conversationId = conversationId;
    this.role = role;
    this.content = content;
    this.timestamp = new Date();
    this.metadata = metadata;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
