import { MessageDto } from '../dto/message.dto';

/**
 * Memento que guarda el estado del agente en un punto específico.
 */
export class AgentMemento {
  constructor(
    public readonly conversationId: string,
    public readonly messages: MessageDto[],
    public readonly modelId: string,
    public readonly timestamp: Date,
  ) {}

  /**
   * Serializa el memento para almacenamiento
   */
  serialize(): string {
    return JSON.stringify({
      conversationId: this.conversationId,
      messages: this.messages,
      modelId: this.modelId,
      timestamp: this.timestamp.toISOString(),
    });
  }

  /**
   * Deserializa un memento desde almacenamiento
   */
  static deserialize(data: string): AgentMemento {
    interface ParsedMemento {
      conversationId: string;
      messages: MessageDto[];
      modelId: string;
      timestamp: string;
    }
    const parsed: ParsedMemento = JSON.parse(data) as ParsedMemento;
    return new AgentMemento(
      parsed.conversationId,
      parsed.messages,
      parsed.modelId,
      new Date(parsed.timestamp),
    );
  }
}
