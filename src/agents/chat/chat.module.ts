// src/agents/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { SystemPromptService } from '../prompts/chat/system-prompt.chat.';
import { ConversationCacheDecorator } from './cache/conversation-cache.decorator';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MementoCaretaker } from './memento/memento-caretaker';
import { LongTermMemoryStrategy } from './memory/long-term-memory.strategy';
import { MemoryFactory } from './memory/memory-factory';
import { ShortTermMemoryStrategy } from './memory/short-term-memory.strategy';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    SystemPromptService,
    ConversationRepository,
    MessageRepository,
    ShortTermMemoryStrategy,
    LongTermMemoryStrategy,
    MemoryFactory,
    MementoCaretaker,
    ConversationCacheDecorator,
  ],
  exports: [ChatService],
})
export class ChatModule {}
