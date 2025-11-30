import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { MessageDto } from './message.dto';

export class ConversationDto {
  @ApiProperty({ description: 'ID de la conversación' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'ID del usuario' })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Mensajes de la conversación',
    type: [MessageDto],
  })
  @IsArray()
  messages: MessageDto[];

  @ApiProperty({ description: 'Modelo usado', required: false })
  @IsString()
  @IsOptional()
  modelId?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}
