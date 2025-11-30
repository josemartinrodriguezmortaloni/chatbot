// src/agents/chat/entities/conversation.entity.ts
import { MessageEntity } from './message.entity';

/**
 * Entidad de conversación para persistencia en base de datos.
 * Representa una conversación completa entre un usuario y el agente.
 */
export class ConversationEntity {
  id: string;
  userId: string;
  modelId?: string;
  messages: MessageEntity[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;

  constructor(userId: string, modelId?: string) {
    this.id = this.generateId();
    this.userId = userId;
    this.modelId = modelId;
    this.messages = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isArchived = false;
  }

  addMessage(message: MessageEntity): void {
    this.messages.push(message);
    this.updatedAt = new Date();
  }

  archive(): void {
    this.isArchived = true;
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
