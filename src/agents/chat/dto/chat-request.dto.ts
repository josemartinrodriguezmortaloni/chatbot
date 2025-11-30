import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AgentModelId } from '../../common/model-registry';

export class ChatRequestDto {
  @ApiProperty({
    description: 'Mensaje o pregunta del usuario',
    example: '¿Qué es la inteligencia artificial?',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    description: 'Identificador único del usuario',
    example: 'user_123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'Modelo de IA a utilizar',
    enum: ['gpt-5.1', 'claude-opus-4.5', 'gemini-3-pro'],
    default: 'gpt-5.1',
  })
  @IsOptional()
  @IsIn(['gpt-5.1', 'claude-opus-4.5', 'gemini-3-pro'])
  modelId?: AgentModelId;
}
