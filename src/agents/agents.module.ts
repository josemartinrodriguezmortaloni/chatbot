import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { RagModule } from './rag/rag.module';
import { ToolsService } from './tools/tools.service';

@Module({
  imports: [ChatModule, RagModule],
  providers: [ToolsService]
})
export class AgentsModule {}
