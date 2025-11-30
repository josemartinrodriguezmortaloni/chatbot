import {
  getModel,
  getConfiguredModel,
  getModelDefaultConfig,
  AgentModelId,
} from './model-registry';
import { ModelProviderFactory } from './model-provider-factory';
import { PRESET_DEFAULT } from './ai-presets';
import { AIModelConfig } from './ai-config.interface';
import { LanguageModel } from 'ai';

// Mock del Factory
jest.mock('./model-provider-factory');

describe('Model Registry', () => {
  let mockModel: LanguageModel;

  beforeEach(() => {
    jest.clearAllMocks();
    mockModel = {} as LanguageModel;
    (ModelProviderFactory.createModel as jest.Mock).mockReturnValue(mockModel);
  });

  describe('getConfiguredModel', () => {
    it('debería retornar un modelo configurado con configuración por defecto', () => {
      const result = getConfiguredModel('gpt-5.1');

      expect(ModelProviderFactory.createModel).toHaveBeenCalledWith(
        'openai',
        'gpt-5.1',
        PRESET_DEFAULT,
      );
      expect(result.model).toBe(mockModel);
      expect(result.config).toEqual(PRESET_DEFAULT);
      expect(result.modelId).toBe('gpt-5.1');
      expect(result.provider).toBe('openai');
    });

    it('debería retornar un modelo configurado con configuración personalizada', () => {
      const overrideConfig: Partial<AIModelConfig> = {
        temperature: 0.9,
        maxTokens: 1000,
      };

      const result = getConfiguredModel('gpt-5.1', overrideConfig);

      expect(ModelProviderFactory.createModel).toHaveBeenCalledWith(
        'openai',
        'gpt-5.1',
        expect.objectContaining({
          ...PRESET_DEFAULT,
          ...overrideConfig,
        }),
      );
      expect(result.config.temperature).toBe(0.9);
      expect(result.config.maxTokens).toBe(1000);
    });

    it('debería retornar modelo Anthropic correctamente', () => {
      const result = getConfiguredModel('claude-opus-4.5');

      expect(ModelProviderFactory.createModel).toHaveBeenCalledWith(
        'anthropic',
        'claude-opus-4-20250514',
        PRESET_DEFAULT,
      );
      expect(result.modelId).toBe('claude-opus-4.5');
      expect(result.provider).toBe('anthropic');
    });

    it('debería retornar modelo Google correctamente', () => {
      const result = getConfiguredModel('gemini-3-pro');

      expect(ModelProviderFactory.createModel).toHaveBeenCalledWith(
        'google',
        'gemini-3-pro-preview',
        PRESET_DEFAULT,
      );
      expect(result.modelId).toBe('gemini-3-pro');
      expect(result.provider).toBe('google');
    });

    it('debería usar gpt-5.1 como modelo por defecto', () => {
      const result = getConfiguredModel();

      expect(ModelProviderFactory.createModel).toHaveBeenCalledWith(
        'openai',
        'gpt-5.1',
        PRESET_DEFAULT,
      );
      expect(result.modelId).toBe('gpt-5.1');
    });

    it('debería lanzar error para modelId inválido', () => {
      const invalidModelId = 'invalid-model' as AgentModelId;

      expect(() => {
        getConfiguredModel(invalidModelId);
      }).toThrow(/Model definition for 'invalid-model' not found/);
    });
  });

  describe('getModel', () => {
    it('debería retornar solo el modelo sin configuración adicional', () => {
      const model = getModel('gpt-5.1');

      expect(ModelProviderFactory.createModel).toHaveBeenCalled();
      expect(model).toBe(mockModel);
    });

    it('debería retornar modelo con configuración personalizada', () => {
      const overrideConfig: Partial<AIModelConfig> = {
        temperature: 0.8,
      };

      const model = getModel('gpt-5.1', overrideConfig);

      expect(ModelProviderFactory.createModel).toHaveBeenCalledWith(
        'openai',
        'gpt-5.1',
        expect.objectContaining({
          ...PRESET_DEFAULT,
          ...overrideConfig,
        }),
      );
      expect(model).toBe(mockModel);
    });

    it('debería usar gpt-5.1 como modelo por defecto', () => {
      getModel();

      expect(ModelProviderFactory.createModel).toHaveBeenCalledWith(
        'openai',
        'gpt-5.1',
        PRESET_DEFAULT,
      );
    });
  });

  describe('getModelDefaultConfig', () => {
    it('debería retornar la configuración por defecto de un modelo', () => {
      const config = getModelDefaultConfig('gpt-5.1');

      expect(config).toEqual(PRESET_DEFAULT);
    });

    it('debería retornar configuración por defecto sin crear instancia del modelo', () => {
      const config = getModelDefaultConfig('claude-opus-4.5');

      expect(config).toEqual(PRESET_DEFAULT);
      expect(ModelProviderFactory.createModel).not.toHaveBeenCalled();
    });

    it('debería retornar una copia de la configuración (no referencia)', () => {
      const config1 = getModelDefaultConfig('gpt-5.1');
      const config2 = getModelDefaultConfig('gpt-5.1');

      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2); // Diferentes referencias
    });

    it('debería lanzar error para modelId inválido', () => {
      const invalidModelId = 'invalid-model' as AgentModelId;

      expect(() => {
        getModelDefaultConfig(invalidModelId);
      }).toThrow(/Model definition for 'invalid-model' not found/);
    });
  });
});

