import { ApiProperty } from '@nestjs/swagger';
import { MessageDto } from './message.dto';

export class ChatResponseDto {
  @ApiProperty({ description: 'Respuesta del asistente' })
  response: string;

  @ApiProperty({ description: 'ID de la conversación' })
  conversationId: string;

  @ApiProperty({
    description: 'Mensajes de la conversación',
    type: [MessageDto],
  })
  messages: MessageDto[];

  @ApiProperty({ description: 'Metadata de la respuesta' })
  metadata: {
    modelId: string;
    tokensUsed?: number;
    responseTime?: number;
  };
}
