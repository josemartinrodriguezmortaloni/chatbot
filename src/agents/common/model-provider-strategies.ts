import { AnthropicProvider } from '@ai-sdk/anthropic';
import { GoogleGenerativeAIProvider } from '@ai-sdk/google';
import { OpenAIProvider } from '@ai-sdk/openai';
import { LanguageModel } from 'ai';
import { AIModelConfig } from './ai-config.interface';
import { IModelProviderStrategy } from './model-provider-strategy.interface';

/**
 * Estrategia para proveedores OpenAI.
 * Mapea la configuración unificada a las opciones específicas de OpenAI.
 */
export class OpenAIStrategy implements IModelProviderStrategy {
  constructor(private readonly provider: OpenAIProvider) {}

  createModel(modelId: string, config?: AIModelConfig): LanguageModel {
    const providerOptions = this.mapConfigToProviderOptions(config);

    return this.provider(modelId, {
      structuredOutputs: true,
      ...providerOptions,
    }) as unknown as LanguageModel;
  }

  mapConfigToProviderOptions(config?: AIModelConfig): Record<string, any> {
    if (!config) return {};

    const options: Record<string, any> = {};

    // Mapeo de opciones estándar
    if (config.temperature !== undefined) {
      options.temperature = config.temperature;
    }
    if (config.maxTokens !== undefined) {
      options.maxTokens = config.maxTokens;
    }
    if (config.topP !== undefined) {
      options.topP = config.topP;
    }
    if (config.frequencyPenalty !== undefined) {
      options.frequencyPenalty = config.frequencyPenalty;
    }
    if (config.presencePenalty !== undefined) {
      options.presencePenalty = config.presencePenalty;
    }

    // Mapeo de reasoningEffort a opciones de OpenAI
    if (config.reasoningEffort !== undefined) {
      // OpenAI usa 'none' | 'minimal' | 'low' | 'medium' | 'high'
      // Mapeamos 'low' -> 'low', 'medium' -> 'medium', 'high' -> 'high'
      options.reasoningEffort = config.reasoningEffort;
    }

    return options;
  }
}

/**
 * Estrategia para proveedores Anthropic.
 * Mapea la configuración unificada a las opciones específicas de Anthropic.
 */
export class AnthropicStrategy implements IModelProviderStrategy {
  constructor(private readonly provider: AnthropicProvider) {}

  createModel(modelId: string, config?: AIModelConfig): LanguageModel {
    const providerOptions = this.mapConfigToProviderOptions(config);

    return this.provider(modelId, providerOptions) as unknown as LanguageModel;
  }

  mapConfigToProviderOptions(config?: AIModelConfig): Record<string, any> {
    if (!config) return {};

    const options: Record<string, any> = {};

    // Mapeo de opciones estándar
    if (config.temperature !== undefined) {
      options.temperature = config.temperature;
    }
    if (config.maxTokens !== undefined) {
      options.maxTokens = config.maxTokens;
    }
    if (config.topP !== undefined) {
      options.topP = config.topP;
    }

    // Mapeo de reasoningEffort a 'effort' de Anthropic
    if (config.reasoningEffort !== undefined) {
      options.effort = config.reasoningEffort;
    }

    // Configuración de thinking para modelos con razonamiento
    if (config.reasoningEffort && config.reasoningBudgetTokens) {
      options.thinking = {
        type: 'enabled' as const,
        budgetTokens: config.reasoningBudgetTokens,
      };
    }

    // Incluir resúmenes de razonamiento
    if (config.includeReasoningSummary !== undefined) {
      options.sendReasoning = config.includeReasoningSummary;
    }

    return options;
  }
}

/**
 * Estrategia para proveedores Google Generative AI.
 * Mapea la configuración unificada a las opciones específicas de Google.
 */
export class GoogleStrategy implements IModelProviderStrategy {
  constructor(private readonly provider: GoogleGenerativeAIProvider) {}

  createModel(modelId: string, config?: AIModelConfig): LanguageModel {
    const providerOptions = this.mapConfigToProviderOptions(config);

    return this.provider(modelId, providerOptions) as unknown as LanguageModel;
  }

  mapConfigToProviderOptions(config?: AIModelConfig): Record<string, any> {
    if (!config) return {};

    const options: Record<string, any> = {};

    // Mapeo de opciones estándar
    if (config.temperature !== undefined) {
      options.temperature = config.temperature;
    }
    if (config.maxTokens !== undefined) {
      options.maxTokens = config.maxTokens;
    }
    if (config.topP !== undefined) {
      options.topP = config.topP;
    }

    // Configuración de thinking para modelos Gemini
    const thinkingConfig: Record<string, any> = {};

    if (config.reasoningEffort) {
      // Para Gemini 3: usar thinkingLevel
      // Para Gemini 2.5: usar thinkingBudget
      if (config.reasoningBudgetTokens) {
        thinkingConfig.thinkingBudget = config.reasoningBudgetTokens;
      } else {
        // Mapeo de reasoningEffort a thinkingLevel
        // 'low' -> 'low', 'medium' -> 'low' (default), 'high' -> 'high'
        if (config.reasoningEffort === 'high') {
          thinkingConfig.thinkingLevel = 'high';
        } else {
          thinkingConfig.thinkingLevel = 'low';
        }
      }
    }

    if (config.includeReasoningSummary !== undefined) {
      thinkingConfig.includeThoughts = config.includeReasoningSummary;
    }

    if (Object.keys(thinkingConfig).length > 0) {
      options.thinkingConfig = thinkingConfig;
    }

    return options;
  }
}
