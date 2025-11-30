import { LanguageModel } from 'ai';
import { OpenAIStrategy } from './model-provider-strategies';
import { AnthropicStrategy } from './model-provider-strategies';
import { GoogleStrategy } from './model-provider-strategies';
import { IModelProviderStrategy } from './model-provider-strategy.interface';
import { AIModelConfig } from './ai-config.interface';
import { ProviderSingleton } from './provider-singleton';

/**
 * Tipo que identifica el proveedor de modelos.
 */
export type ProviderType = 'openai' | 'anthropic' | 'google';

/**
 * Factory para crear estrategias de proveedores de modelos.
 * Implementa el patrón Factory Method para encapsular la creación de estrategias.
 */
export class ModelProviderFactory {
  /**
   * Crea una estrategia para el proveedor especificado.
   * @param providerType - Tipo de proveedor
   * @returns Estrategia del proveedor
   */
  static createStrategy(providerType: ProviderType): IModelProviderStrategy {
    switch (providerType) {
      case 'openai':
        return new OpenAIStrategy(ProviderSingleton.getOpenAI());
      case 'anthropic':
        return new AnthropicStrategy(ProviderSingleton.getAnthropic());
      case 'google':
        return new GoogleStrategy(ProviderSingleton.getGoogle());
      default:
        throw new Error(`Unsupported provider type: ${providerType}`);
    }
  }

  /**
   * Crea un modelo directamente usando el factory.
   * Método de conveniencia que combina la creación de estrategia y modelo.
   * @param providerType - Tipo de proveedor
   * @param modelId - Identificador del modelo
   * @param config - Configuración del modelo
   * @returns Modelo de lenguaje configurado
   */
  static createModel(
    providerType: ProviderType,
    modelId: string,
    config?: AIModelConfig,
  ): LanguageModel {
    const strategy = this.createStrategy(providerType);
    return strategy.createModel(modelId, config);
  }
}

