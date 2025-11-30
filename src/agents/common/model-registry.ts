import { LanguageModel } from 'ai';
import { AIModelConfig } from './ai-config.interface';
import { PRESET_DEFAULT } from './ai-presets';
import { ModelProviderFactory, ProviderType } from './model-provider-factory';

/**
 * Identificadores de modelos disponibles en el sistema.
 * Cada ID mapea a un modelo específico de un proveedor.
 */
export type AgentModelId = 'gpt-5.1' | 'claude-opus-4.5' | 'gemini-3-pro';

/**
 * Configuración de modelo en el registro.
 * Define el proveedor, ID del modelo y configuración por defecto.
 */
interface ModelDefinition {
  provider: ProviderType;
  modelId: string;
  defaultConfig: AIModelConfig;
}

/**
 * Registro centralizado de modelos disponibles.
 * Mapea cada AgentModelId a su configuración de proveedor y modelo.
 */
const MODEL_REGISTRY: Record<AgentModelId, ModelDefinition> = {
  'gpt-5.1': {
    provider: 'openai' as const,
    modelId: 'gpt-5.1',
    defaultConfig: PRESET_DEFAULT as AIModelConfig,
  },
  'claude-opus-4.5': {
    provider: 'anthropic' as const,
    modelId: 'claude-opus-4-20250514', // Usando el ID correcto según la documentación
    defaultConfig: PRESET_DEFAULT as AIModelConfig,
  },
  'gemini-3-pro': {
    provider: 'google' as const,
    modelId: 'gemini-3-pro-preview', // Usando el ID correcto según la documentación
    defaultConfig: PRESET_DEFAULT as AIModelConfig,
  },
};

/**
 * Estructura que encapsula el modelo configurado y listo para usar.
 * El modelo ya tiene aplicada la configuración y puede usarse directamente.
 */
export interface ConfiguredModel {
  /**
   * Modelo de lenguaje configurado y listo para usar.
   * Ya tiene aplicada la configuración por defecto.
   */
  model: LanguageModel;

  /**
   * Configuración aplicada al modelo.
   * Útil para referencia o para crear variaciones.
   */
  config: AIModelConfig;

  /**
   * Identificador del modelo en el registro.
   */
  modelId: AgentModelId;

  /**
   * Tipo de proveedor del modelo.
   */
  provider: ProviderType;
}

/**
 * Obtiene un modelo configurado y listo para usar.
 *
 * Implementa el patrón Factory para crear modelos con su configuración aplicada.
 * El modelo retornado ya está completamente configurado y puede usarse directamente
 * en funciones como generateText, streamText, etc.
 *
 * @param modelId - Identificador del modelo en el registro
 * @param overrideConfig - Configuración opcional que sobrescribe la configuración por defecto
 * @returns Modelo configurado y listo para usar
 *
 * @example
 * ```typescript
 * // Usar modelo con configuración por defecto
 * const { model } = getConfiguredModel('gpt-5.1');
 *
 * // Usar modelo con configuración personalizada
 * const { model: creativeModel } = getConfiguredModel('gpt-5.1', {
 *   temperature: 1.0,
 *   reasoningEffort: 'high'
 * });
 * ```
 */
export function getConfiguredModel(
  modelId: AgentModelId = 'gpt-5.1',
  overrideConfig?: Partial<AIModelConfig>,
): ConfiguredModel {
  const definition = MODEL_REGISTRY[modelId];

  if (!definition) {
    throw new Error(
      `Model definition for '${modelId}' not found. Available models: ${Object.keys(MODEL_REGISTRY).join(', ')}`,
    );
  }

  // Fusionar configuración por defecto con override
  const finalConfig: AIModelConfig = {
    ...definition.defaultConfig,
    ...((overrideConfig as Partial<AIModelConfig>) ?? {}),
  };

  // Crear modelo usando Factory Pattern
  const model = ModelProviderFactory.createModel(
    definition.provider,
    definition.modelId,
    finalConfig,
  );

  return {
    model,
    config: finalConfig,
    modelId,
    provider: definition.provider,
  };
}

/**
 * Obtiene solo el modelo de lenguaje (sin configuración adicional).
 * Método de conveniencia para casos donde solo se necesita el modelo.
 *
 * @param modelId - Identificador del modelo
 * @param overrideConfig - Configuración opcional
 * @returns Modelo de lenguaje configurado
 */
export function getModel(
  modelId: AgentModelId = 'gpt-5.1',
  overrideConfig?: Partial<AIModelConfig>,
): LanguageModel {
  return getConfiguredModel(modelId, overrideConfig).model;
}

/**
 * Obtiene la configuración por defecto de un modelo sin crear la instancia.
 * Útil para inspeccionar o modificar la configuración antes de crear el modelo.
 *
 * @param modelId - Identificador del modelo
 * @returns Configuración por defecto del modelo
 */
export function getModelDefaultConfig(modelId: AgentModelId): AIModelConfig {
  const definition = MODEL_REGISTRY[modelId];

  if (!definition) {
    throw new Error(`Model definition for '${modelId}' not found.`);
  }

  return { ...definition.defaultConfig } as AIModelConfig;
}
