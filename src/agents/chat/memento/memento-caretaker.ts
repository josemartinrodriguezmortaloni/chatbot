import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AgentMemento } from './agent-memento';

/**
 * Caretaker que gestiona los mementos del agente.
 * Permite guardar y restaurar estados del agente.
 */
@Injectable()
export class MementoCaretaker {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Guarda un memento del estado actual del agente
   */
  async saveMemento(memento: AgentMemento): Promise<void> {
    const key = this.getMementoKey(memento.conversationId);
    await this.cacheManager.set(key, memento.serialize(), 86400); // 24 horas
  }

  /**
   * Restaura un memento guardado
   */
  async restoreMemento(conversationId: string): Promise<AgentMemento | null> {
    const key = this.getMementoKey(conversationId);
    const serialized = await this.cacheManager.get<string>(key);
    if (!serialized) return null;

    return AgentMemento.deserialize(serialized);
  }

  private getMementoKey(conversationId: string): string {
    return `memento:${conversationId}`;
  }
}
