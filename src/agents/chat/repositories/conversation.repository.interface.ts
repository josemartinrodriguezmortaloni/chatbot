import { ConversationDto } from '../dto/conversation.dto';
import { MessageDto } from '../dto/message.dto';

export interface IConversationRepository {
  create(userId: string, modelId?: string): Promise<ConversationDto>;
  findById(conversationId: string): Promise<ConversationDto | null>;
  findByUserId(userId: string): Promise<ConversationDto[]>;
  addMessage(conversationId: string, message: MessageDto): Promise<void>;
  update(conversation: ConversationDto): Promise<void>;
  delete(conversationId: string): Promise<void>;
}
