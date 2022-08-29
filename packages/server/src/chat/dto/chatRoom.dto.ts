import { PickType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { ChatRoom } from '../entities/chatRoom.entity';

export class InsertChatRoomDto extends PickType(ChatRoom, [
  'sellerId',
  'buyerId',
]) {
  @IsNumber()
  productId!: number;
}

export class GetChatRoomsByProductIdDto extends PickType(ChatRoom, [
  'sellerId',
]) {
  @IsNumber()
  productId!: number;
}

export class GetChatRoomsByUserIdDto extends PickType(ChatRoom, [
  'sellerId',
  'buyerId',
]) {}

export class ChatRoomByIdDto {
  @IsNumber()
  chatRoomId!: number;

  @IsNumber()
  userId: number;
}
