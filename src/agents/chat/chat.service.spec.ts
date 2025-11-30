import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Experimental_Agent as Agent } from 'ai';
import { Cache } from 'cache-manager';
import { getModel } from '../common/model-registry';
import { SystemPromptService } from '../prompts/chat/system-prompt.chat.';
import { ChatService } from './chat.service';

// Mock de dependencias externas
jest.mock('../common/model-registry');
jest.mock('ai');

describe('ChatService', () => {
  let service: ChatService;
  let systemPromptService: jest.Mocked<SystemPromptService>;
  let cacheManager: jest.Mocked<Cache>;

  const mockModel = {} as any;
  const mockAgent = {
    generate: jest.fn(),
  };

  beforeEach(async () => {
    // Mock de SystemPromptService
    systemPromptService = {
      getSystemPrompt: jest.fn().mockReturnValue('You are a helpful assistant'),
    } as any;

    // Mock de CacheManager
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
      wrap: jest.fn(),
      store: {} as any,
    } as any;

    // Mock de getModel
    (getModel as jest.Mock).mockReturnValue(mockModel);

    // Mock de Agent
    (Agent as jest.Mock).mockImplementation(() => mockAgent);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: SystemPromptService,
          useValue: systemPromptService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processChatStream', () => {
    const question = 'What is AI?';
    const userId = 'user-123';
    const modelId = 'gpt-5.1' as const;
    const expectedResponse = 'AI is artificial intelligence...';

    it('debería procesar un mensaje de chat exitosamente', async () => {
      mockAgent.generate.mockResolvedValue({
        text: expectedResponse,
      });

      const result = await service.processChatStream(question, userId, modelId);

      expect(getModel).toHaveBeenCalledWith(modelId);
      expect(systemPromptService.getSystemPrompt).toHaveBeenCalled();
      expect(Agent).toHaveBeenCalledWith({
        model: mockModel,
        system: 'You are a helpful assistant',
      });
      expect(mockAgent.generate).toHaveBeenCalledWith({ prompt: question });
      expect(result).toBe(expectedResponse);
    });

    it('debería usar gpt-5.1 como modelo por defecto', async () => {
      mockAgent.generate.mockResolvedValue({
        text: expectedResponse,
      });

      await service.processChatStream(question, userId);

      expect(getModel).toHaveBeenCalledWith('gpt-5.1');
    });

    it('debería procesar con diferentes modelos', async () => {
      mockAgent.generate.mockResolvedValue({
        text: expectedResponse,
      });

      await service.processChatStream(
        question,
        userId,
        'claude-opus-4.5' as const,
      );

      expect(getModel).toHaveBeenCalledWith('claude-opus-4.5');
    });

    it('debería lanzar error cuando el agente falla', async () => {
      const error = new Error('Agent generation failed');
      mockAgent.generate.mockRejectedValue(error);

      await expect(
        service.processChatStream(question, userId, modelId),
      ).rejects.toThrow('Failed to process IA message:');
    });

    it('debería lanzar error cuando getModel falla', async () => {
      const error = new Error('Model not found');
      (getModel as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(
        service.processChatStream(question, userId, modelId),
      ).rejects.toThrow('Failed to process IA message:');
    });

    it('debería usar el system prompt del servicio', async () => {
      const customPrompt = 'You are a coding assistant';
      systemPromptService.getSystemPrompt.mockReturnValue(customPrompt);
      mockAgent.generate.mockResolvedValue({
        text: expectedResponse,
      });

      await service.processChatStream(question, userId, modelId);

      expect(Agent).toHaveBeenCalledWith({
        model: mockModel,
        system: customPrompt,
      });
    });
  });
});
