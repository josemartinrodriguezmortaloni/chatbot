// src/agents/chat/repositories/message.repository.ts
import { Injectable } from '@nestjs/common';
import { MessageDto } from '../dto/message.dto';
import { MessageEntity } from '../entities/message.entity';

/**
 * Interfaz para el repositorio de mensajes
 */
export interface IMessageRepository {
  create(message: MessageDto, conversationId: string): Promise<MessageEntity>;
  findById(messageId: string): Promise<MessageEntity | null>;
  findByConversationId(conversationId: string): Promise<MessageEntity[]>;
  delete(messageId: string): Promise<void>;
}

/**
 * Implementación del repositorio de mensajes.
 * Por ahora usa solo cache, pero puede extenderse para usar BD.
 */
@Injectable()
export class MessageRepository implements IMessageRepository {
  async create(
    message: MessageDto,
    conversationId: string,
  ): Promise<MessageEntity> {
    const entity = new MessageEntity(
      conversationId,
      message.role,
      message.content,
      message.metadata,
    );
    entity.timestamp = message.timestamp || new Date();

    // TODO: Persistir en base de datos
    await Promise.resolve();
    return entity;
  }

  async findById(_messageId: string): Promise<MessageEntity | null> {
    // TODO: Buscar en base de datos usando _messageId
    await Promise.resolve();
    return null;
  }

  async findByConversationId(
    _conversationId: string,
  ): Promise<MessageEntity[]> {
    // TODO: Buscar en base de datos usando _conversationId
    await Promise.resolve();
    return [];
  }

  async delete(_messageId: string): Promise<void> {
    // TODO: Eliminar de base de datos usando _messageId
    await Promise.resolve();
  }
}
