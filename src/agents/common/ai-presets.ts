import { AIModelConfig } from './ai-config.interface';

/**
 * Configuración por defecto para modelos de IA.
 * Balancea creatividad, coherencia y costo.
 */
export const PRESET_DEFAULT: AIModelConfig = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.9,
  reasoningEffort: 'medium',
};

/**
 * Configuración para tareas que requieren alta precisión y coherencia.
 * Reduce la creatividad a favor de respuestas más determinísticas.
 */
export const PRESET_PRECISE: AIModelConfig = {
  temperature: 0.3,
  maxTokens: 1024,
  topP: 0.8,
  reasoningEffort: 'high',
};

/**
 * Configuración para tareas creativas que requieren variedad.
 * Aumenta la aleatoriedad y el presupuesto de razonamiento.
 */
export const PRESET_CREATIVE: AIModelConfig = {
  temperature: 1.0,
  maxTokens: 4096,
  topP: 0.95,
  reasoningEffort: 'high',
  reasoningBudgetTokens: 8192,
  includeReasoningSummary: false,
};

/**
 * Configuración optimizada para velocidad y bajo costo.
 * Reduce tokens y esfuerzo de razonamiento.
 */
export const PRESET_FAST: AIModelConfig = {
  temperature: 0.5,
  maxTokens: 512,
  topP: 0.85,
  reasoningEffort: 'low',
};

