import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { ChatLog } from './entities/chatMessage.entity';
import { ChatRoom } from './entities/chatRoom.entity';
import { ProductModule } from '@product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatLog, ChatRoom]), ProductModule],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
