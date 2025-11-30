import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemPromptService {
  constructor() {}

  getSystemPrompt(): string {
    return `You are a helpful assistant`;
  }
}
