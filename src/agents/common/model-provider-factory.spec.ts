import { ModelProviderFactory } from './model-provider-factory';
import { OpenAIStrategy } from './model-provider-strategies';
import { AnthropicStrategy } from './model-provider-strategies';
import { GoogleStrategy } from './model-provider-strategies';
import { IModelProviderStrategy } from './model-provider-strategy.interface';
import { ProviderSingleton } from './provider-singleton';
import { AIModelConfig } from './ai-config.interface';

// Mock de ProviderSingleton
jest.mock('./provider-singleton');

describe('ModelProviderFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createStrategy', () => {
    it('debería crear una estrategia OpenAI para provider "openai"', () => {
      const mockOpenAI = jest.fn();
      (ProviderSingleton.getOpenAI as jest.Mock).mockReturnValue(mockOpenAI);

      const strategy = ModelProviderFactory.createStrategy('openai');

      expect(ProviderSingleton.getOpenAI).toHaveBeenCalled();
      expect(strategy).toBeInstanceOf(OpenAIStrategy);
      // Verificar que la estrategia puede crear modelos
      expect(strategy.createModel).toBeDefined();
    });

    it('debería crear una estrategia Anthropic para provider "anthropic"', () => {
      const mockAnthropic = jest.fn();
      (ProviderSingleton.getAnthropic as jest.Mock).mockReturnValue(
        mockAnthropic,
      );

      const strategy = ModelProviderFactory.createStrategy('anthropic');

      expect(ProviderSingleton.getAnthropic).toHaveBeenCalled();
      expect(strategy).toBeInstanceOf(AnthropicStrategy);
      // Verificar que la estrategia puede crear modelos
      expect(strategy.createModel).toBeDefined();
    });

    it('debería crear una estrategia Google para provider "google"', () => {
      const mockGoogle = jest.fn();
      (ProviderSingleton.getGoogle as jest.Mock).mockReturnValue(mockGoogle);

      const strategy = ModelProviderFactory.createStrategy('google');

      expect(ProviderSingleton.getGoogle).toHaveBeenCalled();
      expect(strategy).toBeInstanceOf(GoogleStrategy);
      // Verificar que la estrategia puede crear modelos
      expect(strategy.createModel).toBeDefined();
    });

    it('debería lanzar error para provider no soportado', () => {
      const unsupportedProvider = 'unsupported' as any;

      expect(() => {
        ModelProviderFactory.createStrategy(unsupportedProvider);
      }).toThrow('Unsupported provider type: unsupported');
    });
  });

  describe('createModel', () => {
    it('debería crear un modelo usando la estrategia correcta', () => {
      const mockModel = {} as any;
      const mockStrategy: IModelProviderStrategy = {
        createModel: jest.fn().mockReturnValue(mockModel),
        mapConfigToProviderOptions: jest.fn(),
      };

      // Mock de createStrategy para retornar nuestra estrategia mock
      jest
        .spyOn(ModelProviderFactory, 'createStrategy')
        .mockReturnValue(mockStrategy);

      const config: AIModelConfig = {
        temperature: 0.7,
      };

      const model = ModelProviderFactory.createModel(
        'openai',
        'gpt-5.1',
        config,
      );

      expect(ModelProviderFactory.createStrategy).toHaveBeenCalledWith('openai');
      expect(mockStrategy.createModel).toHaveBeenCalledWith('gpt-5.1', config);
      expect(model).toBe(mockModel);
    });

    it('debería crear un modelo sin configuración', () => {
      const mockModel = {} as any;
      const mockStrategy: IModelProviderStrategy = {
        createModel: jest.fn().mockReturnValue(mockModel),
        mapConfigToProviderOptions: jest.fn(),
      };

      jest
        .spyOn(ModelProviderFactory, 'createStrategy')
        .mockReturnValue(mockStrategy);

      const model = ModelProviderFactory.createModel('anthropic', 'claude-opus-4-20250514');

      expect(mockStrategy.createModel).toHaveBeenCalledWith(
        'claude-opus-4-20250514',
        undefined,
      );
      expect(model).toBe(mockModel);
    });
  });
});

