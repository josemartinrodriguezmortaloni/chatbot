import { AnthropicProvider } from '@ai-sdk/anthropic';
import { GoogleGenerativeAIProvider } from '@ai-sdk/google';
import { OpenAIProvider } from '@ai-sdk/openai';
import { AIModelConfig } from './ai-config.interface';
import {
    AnthropicStrategy,
    GoogleStrategy,
    OpenAIStrategy,
} from './model-provider-strategies';

describe('Model Provider Strategies', () => {
  describe('OpenAIStrategy', () => {
    let mockProvider: jest.Mock;
    let strategy: OpenAIStrategy;

    beforeEach(() => {
      mockProvider = jest.fn();
      strategy = new OpenAIStrategy(mockProvider as unknown as OpenAIProvider);
    });

    describe('mapConfigToProviderOptions', () => {
      it('debería retornar objeto vacío si no hay configuración', () => {
        const options = strategy.mapConfigToProviderOptions();
        expect(options).toEqual({});
      });

      it('debería mapear opciones estándar correctamente', () => {
        const config: AIModelConfig = {
          temperature: 0.8,
          maxTokens: 1000,
          topP: 0.9,
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          temperature: 0.8,
          maxTokens: 1000,
          topP: 0.9,
        });
      });

      it('debería mapear penalizaciones específicas de OpenAI', () => {
        const config: AIModelConfig = {
          frequencyPenalty: 0.5,
          presencePenalty: 0.3,
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          frequencyPenalty: 0.5,
          presencePenalty: 0.3,
        });
      });

      it('debería mapear reasoningEffort', () => {
        const config: AIModelConfig = {
          reasoningEffort: 'high',
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          reasoningEffort: 'high',
        });
      });

      it('debería mapear todas las opciones juntas', () => {
        const config: AIModelConfig = {
          temperature: 0.7,
          maxTokens: 2048,
          topP: 0.9,
          frequencyPenalty: 0.2,
          presencePenalty: 0.1,
          reasoningEffort: 'medium',
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          temperature: 0.7,
          maxTokens: 2048,
          topP: 0.9,
          frequencyPenalty: 0.2,
          presencePenalty: 0.1,
          reasoningEffort: 'medium',
        });
      });
    });

    describe('createModel', () => {
      it('debería crear un modelo con structuredOutputs habilitado', () => {
        const mockModel = {} as any;
        mockProvider.mockReturnValue(mockModel);

        const model = strategy.createModel('gpt-5.1');

        expect(mockProvider).toHaveBeenCalledWith('gpt-5.1', {
          structuredOutputs: true,
        });
        expect(model).toBeDefined();
      });

      it('debería crear un modelo con configuración personalizada', () => {
        const mockModel = {} as any;
        mockProvider.mockReturnValue(mockModel);
        const config: AIModelConfig = {
          temperature: 0.8,
          maxTokens: 1000,
        };

        strategy.createModel('gpt-5.1', config);

        expect(mockProvider).toHaveBeenCalledWith('gpt-5.1', {
          structuredOutputs: true,
          temperature: 0.8,
          maxTokens: 1000,
        });
      });
    });
  });

  describe('AnthropicStrategy', () => {
    let mockProvider: jest.Mock;
    let strategy: AnthropicStrategy;

    beforeEach(() => {
      mockProvider = jest.fn();
      strategy = new AnthropicStrategy(
        mockProvider as unknown as AnthropicProvider,
      );
    });

    describe('mapConfigToProviderOptions', () => {
      it('debería retornar objeto vacío si no hay configuración', () => {
        const options = strategy.mapConfigToProviderOptions();
        expect(options).toEqual({});
      });

      it('debería mapear opciones estándar', () => {
        const config: AIModelConfig = {
          temperature: 0.8,
          maxTokens: 1000,
          topP: 0.9,
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          temperature: 0.8,
          maxTokens: 1000,
          topP: 0.9,
        });
      });

      it('debería mapear reasoningEffort a effort', () => {
        const config: AIModelConfig = {
          reasoningEffort: 'high',
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          effort: 'high',
        });
      });

      it('debería mapear thinking cuando hay reasoningEffort y reasoningBudgetTokens', () => {
        const config: AIModelConfig = {
          reasoningEffort: 'high',
          reasoningBudgetTokens: 8192,
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          effort: 'high',
          thinking: {
            type: 'enabled',
            budgetTokens: 8192,
          },
        });
      });

      it('debería mapear includeReasoningSummary a sendReasoning', () => {
        const config: AIModelConfig = {
          includeReasoningSummary: true,
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          sendReasoning: true,
        });
      });
    });

    describe('createModel', () => {
      it('debería crear un modelo con la configuración mapeada', () => {
        const mockModel = {} as any;
        mockProvider.mockReturnValue(mockModel);
        const config: AIModelConfig = {
          temperature: 0.7,
          reasoningEffort: 'medium',
        };

        strategy.createModel('claude-opus-4-20250514', config);

        expect(mockProvider).toHaveBeenCalledWith('claude-opus-4-20250514', {
          temperature: 0.7,
          effort: 'medium',
        });
      });
    });
  });

  describe('GoogleStrategy', () => {
    let mockProvider: jest.Mock;
    let strategy: GoogleStrategy;

    beforeEach(() => {
      mockProvider = jest.fn();
      strategy = new GoogleStrategy(
        mockProvider as unknown as GoogleGenerativeAIProvider,
      );
    });

    describe('mapConfigToProviderOptions', () => {
      it('debería retornar objeto vacío si no hay configuración', () => {
        const options = strategy.mapConfigToProviderOptions();
        expect(options).toEqual({});
      });

      it('debería mapear opciones estándar', () => {
        const config: AIModelConfig = {
          temperature: 0.8,
          maxTokens: 1000,
          topP: 0.9,
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          temperature: 0.8,
          maxTokens: 1000,
          topP: 0.9,
        });
      });

      it('debería mapear thinkingLevel cuando reasoningEffort es high', () => {
        const config: AIModelConfig = {
          reasoningEffort: 'high',
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          thinkingConfig: {
            thinkingLevel: 'high',
          },
        });
      });

      it('debería mapear thinkingLevel a low cuando reasoningEffort es medium o low', () => {
        const configMedium: AIModelConfig = {
          reasoningEffort: 'medium',
        };
        const configLow: AIModelConfig = {
          reasoningEffort: 'low',
        };

        const optionsMedium = strategy.mapConfigToProviderOptions(configMedium);
        const optionsLow = strategy.mapConfigToProviderOptions(configLow);

        expect(optionsMedium).toEqual({
          thinkingConfig: {
            thinkingLevel: 'low',
          },
        });
        expect(optionsLow).toEqual({
          thinkingConfig: {
            thinkingLevel: 'low',
          },
        });
      });

      it('debería usar thinkingBudget cuando está presente', () => {
        const config: AIModelConfig = {
          reasoningEffort: 'high',
          reasoningBudgetTokens: 4096,
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          thinkingConfig: {
            thinkingBudget: 4096,
          },
        });
      });

      it('debería mapear includeReasoningSummary a includeThoughts', () => {
        const config: AIModelConfig = {
          includeReasoningSummary: true,
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          thinkingConfig: {
            includeThoughts: true,
          },
        });
      });

      it('debería combinar todas las opciones de thinking', () => {
        const config: AIModelConfig = {
          reasoningEffort: 'high',
          reasoningBudgetTokens: 8192,
          includeReasoningSummary: true,
        };

        const options = strategy.mapConfigToProviderOptions(config);

        expect(options).toEqual({
          thinkingConfig: {
            thinkingBudget: 8192,
            includeThoughts: true,
          },
        });
      });
    });

    describe('createModel', () => {
      it('debería crear un modelo con la configuración mapeada', () => {
        const mockModel = {} as any;
        mockProvider.mockReturnValue(mockModel);
        const config: AIModelConfig = {
          temperature: 0.7,
        };

        strategy.createModel('gemini-3-pro-preview', config);

        expect(mockProvider).toHaveBeenCalledWith('gemini-3-pro-preview', {
          temperature: 0.7,
        });
      });
    });
  });
});
