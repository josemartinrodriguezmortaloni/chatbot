import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Experimental_Agent as Agent } from 'ai';
import { getModel } from '../common/model-registry';
import { SystemPromptService } from '../prompts/chat/system-prompt';
/**
 * Servicio de chat que procesa mensajes usando modelos de IA configurados.
 * Utiliza el registro de modelos para obtener modelos listos para usar.
 */
@Injectable()
export class ChatService {
  constructor(
    private system: SystemPromptService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Procesa un mensaje de chat usando un modelo de IA configurado.
   *
   * @param prompt - Mensaje del usuario
   * @param userId - Identificador del usuario
   * @param modelId - Identificador del modelo a usar (opcional, por defecto 'gpt-5.1')
   * @returns Texto generado por el modelo
   */
  async processChatStream(
    question: string,
    userId: string,
    modelId: 'gpt-5.1' | 'claude-opus-4.5' | 'gemini-3-pro' = 'gpt-5.1',
  ) {
    try {
      const systemPrompt = this.system.getSystemPrompt();
      console.log('Processing message...');

      // Obtener modelo configurado y listo para usar
      const model = getModel(modelId);

      // Crear agente con el modelo configurado
      const agent = new Agent({
        model,
        system: systemPrompt,
      });

      const result = await agent.generate({ prompt: question });
      console.log(result.text);

      return result.text;
    } catch (error) {
      throw new Error(`Failed to process IA message: ${error}`);
    }
  }
}
