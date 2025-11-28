import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { LanguageModel } from 'ai';
import { AIModelConfig } from './ai-config.interface';
import { PRESET_DEFAULT } from './ai-presets';

// --- 1. Inicialización de Proveedores ---
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'strict',
});
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// --- 2. Definición de Tipos ---
export type AgentModelId = 'gpt-5.1' | 'claude-opus-4.5' | 'gemini-3-pro';

/**
 * Estructura que encapsula el modelo Y su configuración ideal por defecto.
 */
export interface DefinedModel {
  model: LanguageModel;
  config: AIModelConfig;
}

// --- 3. Registro con Configuración Vinculada ---
const registry: Record<AgentModelId, DefinedModel> = {
  'gpt-5.1': {
    model: openai('gpt-5.1', { structuredOutputs: true }),
    config: PRESET_DEFAULT,
  },

  'claude-opus-4.5': {
    model: anthropic('claude-opus-4.5'),
    config: PRESET_DEFAULT,
  },

  'gemini-3-pro': {
    model: google('gemini-3-pro'),
    config: PRESET_DEFAULT,
  },
};

// --- 4. Helper de Acceso ---
export function getModelDefinition(
  modelId: AgentModelId = 'gpt-5.1',
): DefinedModel {
  const definition = registry[modelId];

  if (!definition) {
    throw new Error(`Model definition for '${modelId}' not found.`);
  }

  return definition;
}
