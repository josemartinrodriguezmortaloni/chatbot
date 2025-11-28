export type ReasoningEffort = 'low' | 'medium' | 'high';
export interface AIModelConfig {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  ferquencyPenalty?: number;
  presencePenalty?: number;
  reasoningEffort?: ReasoningEffort;
}
