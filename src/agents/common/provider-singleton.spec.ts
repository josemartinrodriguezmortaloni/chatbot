import { ProviderSingleton } from './provider-singleton';
import { OpenAIProvider } from '@ai-sdk/openai';
import { AnthropicProvider } from '@ai-sdk/anthropic';
import { GoogleGenerativeAIProvider } from '@ai-sdk/google';

describe('ProviderSingleton', () => {
  beforeEach(() => {
    // Resetear instancias antes de cada test
    ProviderSingleton.reset();
  });

  afterEach(() => {
    // Limpiar después de cada test
    ProviderSingleton.reset();
  });

  describe('getOpenAI', () => {
    it('debería crear una instancia de OpenAI en la primera llamada', () => {
      const instance = ProviderSingleton.getOpenAI();
      expect(instance).toBeDefined();
      expect(instance).toBeInstanceOf(Function);
    });

    it('debería retornar la misma instancia en llamadas subsecuentes (Singleton)', () => {
      const instance1 = ProviderSingleton.getOpenAI();
      const instance2 = ProviderSingleton.getOpenAI();
      expect(instance1).toBe(instance2);
    });

    it('debería crear una nueva instancia después de reset', () => {
      const instance1 = ProviderSingleton.getOpenAI();
      ProviderSingleton.reset();
      const instance2 = ProviderSingleton.getOpenAI();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('getAnthropic', () => {
    it('debería crear una instancia de Anthropic en la primera llamada', () => {
      const instance = ProviderSingleton.getAnthropic();
      expect(instance).toBeDefined();
      expect(instance).toBeInstanceOf(Function);
    });

    it('debería retornar la misma instancia en llamadas subsecuentes (Singleton)', () => {
      const instance1 = ProviderSingleton.getAnthropic();
      const instance2 = ProviderSingleton.getAnthropic();
      expect(instance1).toBe(instance2);
    });

    it('debería crear una nueva instancia después de reset', () => {
      const instance1 = ProviderSingleton.getAnthropic();
      ProviderSingleton.reset();
      const instance2 = ProviderSingleton.getAnthropic();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('getGoogle', () => {
    it('debería crear una instancia de Google en la primera llamada', () => {
      const instance = ProviderSingleton.getGoogle();
      expect(instance).toBeDefined();
      expect(instance).toBeInstanceOf(Function);
    });

    it('debería retornar la misma instancia en llamadas subsecuentes (Singleton)', () => {
      const instance1 = ProviderSingleton.getGoogle();
      const instance2 = ProviderSingleton.getGoogle();
      expect(instance1).toBe(instance2);
    });

    it('debería crear una nueva instancia después de reset', () => {
      const instance1 = ProviderSingleton.getGoogle();
      ProviderSingleton.reset();
      const instance2 = ProviderSingleton.getGoogle();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('reset', () => {
    it('debería resetear todas las instancias', () => {
      const openai1 = ProviderSingleton.getOpenAI();
      const anthropic1 = ProviderSingleton.getAnthropic();
      const google1 = ProviderSingleton.getGoogle();

      ProviderSingleton.reset();

      const openai2 = ProviderSingleton.getOpenAI();
      const anthropic2 = ProviderSingleton.getAnthropic();
      const google2 = ProviderSingleton.getGoogle();

      expect(openai1).not.toBe(openai2);
      expect(anthropic1).not.toBe(anthropic2);
      expect(google1).not.toBe(google2);
    });
  });
});

