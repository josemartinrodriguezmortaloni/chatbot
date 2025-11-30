import { Injectable } from '@nestjs/common';
import { MessageDto } from '../dto/message.dto';
import { IConversationRepository } from '../repositories/conversation.repository.interface';
import { IMemoryStrategy } from './memory-stategy.interface';

/**
 * Estrategia de memoria a largo plazo.
 * Mantiene todo el historial de la conversación (útil para contexto completo).
 */
@Injectable()
export class LongTermMemoryStrategy implements IMemoryStrategy {
  constructor(
    private readonly conversationRepository: IConversationRepository,
  ) {}

  async getContextMessages(
    conversationId: string,
    maxMessages?: number,
  ): Promise<MessageDto[]> {
    const conversation =
      await this.conversationRepository.findById(conversationId);
    if (!conversation) return [];

    // Retornar todos los mensajes o los últimos N si se especifica
    if (maxMessages) {
      return conversation.messages.slice(-maxMessages);
    }
    return conversation.messages;
  }

  async saveMessage(
    conversationId: string,
    message: MessageDto,
  ): Promise<void> {
    await this.conversationRepository.addMessage(conversationId, message);
  }

  async clear(_conversationId: string): Promise<void> {
    // En memoria a largo plazo, no limpiamos, solo marcamos como archivada
    // O implementar lógica de archivado
    // El parámetro se marca con _ para indicar que no se usa intencionalmente
    await Promise.resolve();
  }
}
