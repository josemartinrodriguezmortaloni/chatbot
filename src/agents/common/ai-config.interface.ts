/**
 * Nivel de esfuerzo de razonamiento unificado para todos los proveedores.
 * Mapea a las opciones específicas de cada proveedor:
 * - OpenAI: 'none' | 'minimal' | 'low' | 'medium' | 'high'
 * - Anthropic: 'low' | 'medium' | 'high' (effort)
 * - Google: 'low' | 'high' (thinkingLevel) o thinkingBudget (number)
 */
export type UnifiedReasoningEffort = 'low' | 'medium' | 'high';

/**
 * Configuración unificada de modelos de IA compatible con OpenAI, Anthropic y Google.
 * Esta interfaz abstrae las diferencias entre proveedores y proporciona una API común.
 */
export interface AIModelConfig {
  /**
   * Controla la aleatoriedad de las respuestas (0.0 - 2.0).
   * Valores más bajos = más determinístico, valores más altos = más creativo.
   * Compatible con todos los proveedores.
   */
  temperature?: number;

  /**
   * Número máximo de tokens a generar.
   * Compatible con todos los proveedores.
   */
  maxTokens?: number;

  /**
   * Controla la diversidad mediante el muestreo de núcleo (0.0 - 1.0).
   * Compatible con todos los proveedores.
   */
  topP?: number;

  /**
   * Penalización de frecuencia para reducir repeticiones (OpenAI únicamente).
   * Rango: -2.0 a 2.0. Valores negativos aumentan la probabilidad de repetición.
   */
  frequencyPenalty?: number;

  /**
   * Penalización de presencia para fomentar nuevos temas (OpenAI únicamente).
   * Rango: -2.0 a 2.0. Valores negativos aumentan la probabilidad de repetir temas.
   */
  presencePenalty?: number;

  /**
   * Nivel de esfuerzo de razonamiento unificado.
   * Se mapea automáticamente a las opciones específicas de cada proveedor.
   */
  reasoningEffort?: UnifiedReasoningEffort;

  /**
   * Presupuesto de tokens para razonamiento (Anthropic y Google).
   * Solo aplica cuando reasoningEffort está configurado.
   */
  reasoningBudgetTokens?: number;

  /**
   * Incluir resúmenes de razonamiento en la respuesta (Google y Anthropic).
   * Permite ver el proceso de pensamiento del modelo.
   */
  includeReasoningSummary?: boolean;
}
