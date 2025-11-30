import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheKeyBuilder } from '../cache/cache-key.builder';
import { ConversationDto } from '../dto/conversation.dto';
import { MessageDto } from '../dto/message.dto';
import { IConversationRepository } from './conversation.repository.interface';

@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // Aquí inyectarías tu servicio de base de datos
  ) {}

  async create(userId: string, modelId?: string): Promise<ConversationDto> {
    const conversation: ConversationDto = {
      id: this.generateId(),
      userId,
      modelId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Guardar en cache y BD
    await this.cacheManager.set(
      this.getCacheKey(conversation.id),
      conversation,
      3600, // 1 hora
    );

    // TODO: Guardar en base de datos
    return conversation;
  }

  async findById(conversationId: string): Promise<ConversationDto | null> {
    // Intentar desde cache primero
    const cached = await this.cacheManager.get<ConversationDto>(
      this.getCacheKey(conversationId),
    );
    if (cached) return cached;

    // TODO: Buscar en base de datos
    return null;
  }

  async addMessage(conversationId: string, message: MessageDto): Promise<void> {
    const conversation = await this.findById(conversationId);
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    conversation.messages.push({
      ...message,
      timestamp: new Date(),
    });
    conversation.updatedAt = new Date();

    // Actualizar cache y BD
    await this.cacheManager.set(
      this.getCacheKey(conversationId),
      conversation,
      3600,
    );
    // TODO: Actualizar en BD
  }

  private getCacheKey(conversationId: string): string {
    return CacheKeyBuilder.conversation(conversationId);
  }

  private generateId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async findByUserId(userId: string): Promise<ConversationDto[]> {
    // Intentar desde cache primero
    const cacheKey = CacheKeyBuilder.userConversations(userId);
    const cached = await this.cacheManager.get<ConversationDto[]>(cacheKey);
    if (cached) return cached;

    // TODO: Buscar en base de datos
    // Por ahora retornar array vacío
    return [];
  }

  async update(conversation: ConversationDto): Promise<void> {
    conversation.updatedAt = new Date();

    // Actualizar cache
    await this.cacheManager.set(
      this.getCacheKey(conversation.id),
      conversation,
      3600,
    );

    // TODO: Actualizar en base de datos
  }

  async delete(conversationId: string): Promise<void> {
    // Eliminar del cache
    await this.cacheManager.del(this.getCacheKey(conversationId));

    // TODO: Eliminar de base de datos
  }
}
