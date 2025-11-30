import { AnthropicProvider, createAnthropic } from '@ai-sdk/anthropic';
import {
  GoogleGenerativeAIProvider,
  createGoogleGenerativeAI,
} from '@ai-sdk/google';
import { OpenAIProvider, createOpenAI } from '@ai-sdk/openai';

/**
 * Singleton para instancias de proveedores de modelos de IA.
 * Garantiza una única instancia de cada proveedor en toda la aplicación,
 * optimizando el uso de recursos y manteniendo la configuración centralizada.
 *
 * Implementa el patrón Singleton usando Lazy Initialization (inicialización perezosa).
 */
export class ProviderSingleton {
  private static openaiInstance: OpenAIProvider | null = null;
  private static anthropicInstance: AnthropicProvider | null = null;
  private static googleInstance: GoogleGenerativeAIProvider | null = null;

  /**
   * Obtiene la instancia singleton de OpenAI.
   * Crea la instancia si no existe (Lazy Initialization).
   */
  static getOpenAI(): OpenAIProvider {
    if (!this.openaiInstance) {
      this.openaiInstance = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        compatibility: 'strict',
      });
    }
    return this.openaiInstance;
  }

  /**
   * Obtiene la instancia singleton de Anthropic.
   * Crea la instancia si no existe (Lazy Initialization).
   */
  static getAnthropic(): AnthropicProvider {
    if (!this.anthropicInstance) {
      this.anthropicInstance = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
    return this.anthropicInstance;
  }

  /**
   * Obtiene la instancia singleton de Google Generative AI.
   * Crea la instancia si no existe (Lazy Initialization).
   */
  static getGoogle(): GoogleGenerativeAIProvider {
    if (!this.googleInstance) {
      this.googleInstance = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
    }
    return this.googleInstance;
  }

  /**
   * Resetea todas las instancias singleton.
   * Útil para testing o reinicio de configuración.
   */
  static reset(): void {
    this.openaiInstance = null;
    this.anthropicInstance = null;
    this.googleInstance = null;
  }
}
