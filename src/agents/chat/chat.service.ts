// src/agents/chat/chat.service.ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Experimental_Agent as Agent } from 'ai';
import { Cache } from 'cache-manager';
import { getModel } from '../common/model-registry';
import { SystemPromptService } from '../prompts/chat/system-prompt.chat.';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { MessageDto, MessageRole } from './dto/message.dto';
import { AgentMemento } from './memento/agent-memento';
import { MementoCaretaker } from './memento/memento-caretaker';
import { MemoryFactory, MemoryType } from './memory/memory-factory';
import { IConversationRepository } from './repositories/conversation.repository.interface';

@Injectable()
export class ChatService {
  constructor(
    private readonly systemPromptService: SystemPromptService,
    private readonly conversationRepository: IConversationRepository,
    private readonly memoryFactory: MemoryFactory,
    private readonly mementoCaretaker: MementoCaretaker,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Procesa un mensaje de chat usando un modelo de IA configurado.
   * Ahora soporta conversaciones, memoria y mementos.
   */
  async processChatStream(
    request: ChatRequestDto,
    conversationId?: string,
    memoryType: MemoryType = 'short-term',
  ): Promise<ChatResponseDto> {
    try {
      // 1. Obtener o crear conversación
      let conversation = conversationId
        ? await this.conversationRepository.findById(conversationId)
        : null;

      if (!conversation) {
        conversation = await this.conversationRepository.create(
          request.userId,
          request.modelId,
        );
      }

      // 2. Obtener estrategia de memoria
      const memoryStrategy = this.memoryFactory.createStrategy(memoryType);

      // 3. Obtener contexto histórico
      const contextMessages = await memoryStrategy.getContextMessages(
        conversation.id,
      );

      // 4. Guardar mensaje del usuario
      const userMessage: MessageDto = {
        role: MessageRole.USER,
        content: request.prompt,
        timestamp: new Date(),
      };
      await memoryStrategy.saveMessage(conversation.id, userMessage);

      // 5. Preparar mensajes para el agente
      const systemPrompt = this.systemPromptService.getSystemPrompt();
      const model = getModel(request.modelId || 'gpt-5.1');

      // 6. Crear y ejecutar agente
      const agent = new Agent({
        model,
        system: systemPrompt,
      });

      const startTime = Date.now();
      const result = await agent.generate({ prompt: request.prompt });
      const responseTime = Date.now() - startTime;

      // 7. Guardar respuesta del asistente
      const assistantMessage: MessageDto = {
        role: MessageRole.ASSISTANT,
        content: result.text,
        timestamp: new Date(),
        metadata: {
          modelId: request.modelId || 'gpt-5.1',
          responseTime,
          tokensUsed: result.usage?.totalTokens,
        },
      };
      await memoryStrategy.saveMessage(conversation.id, assistantMessage);

      // 8. Guardar memento del estado actual
      const allMessages = [...contextMessages, userMessage, assistantMessage];
      const memento = new AgentMemento(
        conversation.id,
        allMessages,
        request.modelId || 'gpt-5.1',
        new Date(),
      );
      await this.mementoCaretaker.saveMemento(memento);

      // 9. Obtener conversación actualizada
      const updatedConversation = await this.conversationRepository.findById(
        conversation.id,
      );

      // 10. Retornar respuesta
      return {
        response: result.text,
        conversationId: conversation.id,
        messages: updatedConversation?.messages || [],
        metadata: {
          modelId: request.modelId || 'gpt-5.1',
          tokensUsed: result.usage?.totalTokens,
          responseTime,
        },
      };
    } catch (error) {
      throw new Error(`Failed to process IA message: ${error}`);
    }
  }
}
