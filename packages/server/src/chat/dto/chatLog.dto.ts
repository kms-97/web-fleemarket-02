import { PickType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { ChatLog } from '../entities/chatMessage.entity';

export class InsertChatLogDto extends PickType(ChatLog, ['userId', 'content']) {
  @IsNumber()
  chatRoomId!: number;
}

export class UpdateChatLogDto extends PickType(ChatLog, ['userId', 'id']) {}
