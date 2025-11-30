import { MessageDto } from '../dto/message.dto';

export interface IMemoryStrategy {
  /**
   * Obtiene el historial de mensajes para el contexto del agente
   */
  getContextMessages(
    conversationId: string,
    maxMessages?: number,
  ): Promise<MessageDto[]>;

  /**
   * Guarda un mensaje en la memoria
   */
  saveMessage(conversationId: string, message: MessageDto): Promise<void>;

  /**
   * Limpia la memoria (opcional)
   */
  clear(conversationId: string): Promise<void>;
}
