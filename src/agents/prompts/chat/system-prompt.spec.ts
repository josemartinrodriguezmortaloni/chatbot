import { SystemPromptService } from './system-prompt.chat.';

describe('SystemPromptService', () => {
  let service: SystemPromptService;

  beforeEach(() => {
    service = new SystemPromptService();
  });

  describe('getSystemPrompt', () => {
    it('debería retornar un string con el prompt del sistema', () => {
      const prompt = service.getSystemPrompt();

      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('debería retornar el prompt esperado', () => {
      const prompt = service.getSystemPrompt();

      expect(prompt).toContain('helpful assistant');
    });

    it('debería retornar el mismo prompt en múltiples llamadas', () => {
      const prompt1 = service.getSystemPrompt();
      const prompt2 = service.getSystemPrompt();

      expect(prompt1).toBe(prompt2);
    });
  });
});
