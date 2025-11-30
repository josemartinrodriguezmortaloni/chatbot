// src/agents/chat/cache/conversation-cache.decorator.ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ConversationDto } from '../dto/conversation.dto';
import { CacheKeyBuilder } from './cache-key.builder';

/**
 * Decorator/Service para manejar el cacheo de conversaciones.
 * Implementa el patrón Decorator para agregar funcionalidad de cache
 * sin modificar la lógica del repositorio.
 */
@Injectable()
export class ConversationCacheDecorator {
  private readonly TTL = 3600; // 1 hora en segundos

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Obtiene una conversación del cache
   */
  async get(conversationId: string): Promise<ConversationDto | null> {
    const key = CacheKeyBuilder.conversation(conversationId);
    return await this.cacheManager.get<ConversationDto>(key);
  }

  /**
   * Guarda una conversación en el cache
   */
  async set(conversation: ConversationDto, ttl?: number): Promise<void> {
    const key = CacheKeyBuilder.conversation(conversation.id);
    await this.cacheManager.set(key, conversation, ttl || this.TTL);
  }

  /**
   * Elimina una conversación del cache
   */
  async delete(conversationId: string): Promise<void> {
    const key = CacheKeyBuilder.conversation(conversationId);
    await this.cacheManager.del(key);
  }

  /**
   * Invalida el cache de conversaciones de un usuario
   */
  async invalidateUserConversations(userId: string): Promise<void> {
    const key = CacheKeyBuilder.userConversations(userId);
    await this.cacheManager.del(key);
  }

  /**
   * Limpia todo el cache de conversaciones (útil para testing)
   */
  async clear(): Promise<void> {
    // Nota: Esto requiere acceso a todas las claves, que puede no estar disponible
    // dependiendo de la implementación del cache manager
    // En producción, usaría un patrón de tags o namespaces
  }
}
