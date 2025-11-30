// src/agents/chat/cache/cache-key.builder.ts
/**
 * Builder para construir claves de cache de forma consistente.
 * Centraliza la lógica de generación de claves para evitar inconsistencias.
 */
export class CacheKeyBuilder {
  private static readonly PREFIX_CONVERSATION = 'conversation';
  private static readonly PREFIX_MEMENTO = 'memento';
  private static readonly PREFIX_USER_CONVERSATIONS = 'user:conversations';
  private static readonly PREFIX_MESSAGE = 'message';

  /**
   * Construye la clave de cache para una conversación
   */
  static conversation(conversationId: string): string {
    return `${this.PREFIX_CONVERSATION}:${conversationId}`;
  }

  /**
   * Construye la clave de cache para un memento
   */
  static memento(conversationId: string): string {
    return `${this.PREFIX_MEMENTO}:${conversationId}`;
  }

  /**
   * Construye la clave de cache para las conversaciones de un usuario
   */
  static userConversations(userId: string): string {
    return `${this.PREFIX_USER_CONVERSATIONS}:${userId}`;
  }

  /**
   * Construye la clave de cache para un mensaje
   */
  static message(messageId: string): string {
    return `${this.PREFIX_MESSAGE}:${messageId}`;
  }

  /**
   * Construye una clave personalizada con prefijo
   */
  static custom(prefix: string, identifier: string): string {
    return `${prefix}:${identifier}`;
  }
}
