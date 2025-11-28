import { AIModelConfig } from './ai-config.interface';

export const PRESET_DEFAULT: AIModelConfig = {
  temperature: 0.5,
  maxTokens: 1000,
  topP: 0.9,
  reasoningEffort: 'high',
};
