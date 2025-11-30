import { Injectable } from '@nestjs/common';
import { MessageDto } from '../dto/message.dto';
import { IConversationRepository } from '../repositories/conversation.repository.interface';
import { IMemoryStrategy } from './memory-stategy.interface';

/**
 * Estrategia de memoria a corto plazo.
 * Mantiene solo los últimos N mensajes en memoria (útil para contexto inmediato).
 */
@Injectable()
export class ShortTermMemoryStrategy implements IMemoryStrategy {
  private readonly MAX_MESSAGES = 10; // Últimos 10 mensajes

  constructor(
    private readonly conversationRepository: IConversationRepository,
  ) {}

  async getContextMessages(
    conversationId: string,
    maxMessages: number = this.MAX_MESSAGES,
  ): Promise<MessageDto[]> {
    const conversation =
      await this.conversationRepository.findById(conversationId);
    if (!conversation) return [];

    // Retornar solo los últimos N mensajes
    return conversation.messages.slice(-maxMessages);
  }

  async saveMessage(
    conversationId: string,
    message: MessageDto,
  ): Promise<void> {
    await this.conversationRepository.addMessage(conversationId, message);
  }

  async clear(conversationId: string): Promise<void> {
    const conversation =
      await this.conversationRepository.findById(conversationId);
    if (conversation) {
      conversation.messages = [];
      await this.conversationRepository.update(conversation);
    }
  }
}
