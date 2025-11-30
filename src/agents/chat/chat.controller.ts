// src/agents/chat/chat.controller.ts
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Procesa un mensaje de chat' })
  @ApiResponse({
    status: 200,
    description: 'Respuesta del agente',
    type: ChatResponseDto,
  })
  @ApiQuery({
    name: 'conversationId',
    required: false,
    description: 'ID de la conversación existente',
  })
  @ApiQuery({
    name: 'memoryType',
    required: false,
    enum: ['short-term', 'long-term'],
    description: 'Tipo de memoria a usar',
  })
  async chat(
    @Body() body: ChatRequestDto,
    @Query('conversationId') conversationId?: string,
    @Query('memoryType') memoryType: 'short-term' | 'long-term' = 'short-term',
  ): Promise<ChatResponseDto> {
    return await this.chatService.processChatStream(
      body,
      conversationId,
      memoryType,
    );
  }
}
