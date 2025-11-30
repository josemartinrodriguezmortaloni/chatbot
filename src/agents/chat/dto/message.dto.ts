import { ApiProperty } from '@nestjs/swagger';
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export class MessageDto {
  @ApiProperty({ description: 'Rol del mensaje', enum: MessageRole })
  @IsEnum(MessageRole)
  @IsNotEmpty()
  role: MessageRole;

  @ApiProperty({ description: 'Contenido del mensaje' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Timestamp del mensaje', required: false })
  @IsDate()
  @IsOptional()
  timestamp?: Date;

  @ApiProperty({ description: 'Metadata adicional', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}
